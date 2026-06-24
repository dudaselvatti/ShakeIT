import { db } from "../../../config/firebase";
import {
    collection,
    doc,
    writeBatch,
    serverTimestamp
} from "firebase/firestore";
import axios from "axios";
import { PartyParticipant } from "../../../types/PartyParticipant";
import { DrawRestrictionResponseDTO } from "../../../dto/DrawRestriction/DrawRestrictionResponseDTO";
import { getPartyFromCloud } from "../../cloud/Party/PartyDb";
import { getParticipantsByPartyId } from "../../cloud/PartyParticipant/PartyParticipantDb";
import { getDrawRestrictionsByPartyFromCloud } from "../../cloud/DrawRestriction/DrawRestrictionDb";

export type BlockMap = Map<string, Set<string>>;

export interface DrawPair {
    giver_profile_id: string;
    receiver_profile_id: string;
}

export interface DrawAlgorithmInput {
    participants: PartyParticipant[];
    restrictions: DrawRestrictionResponseDTO[];
    blockDependentDraw: boolean;
}

export class UnsolvableGraphError extends Error {
    constructor(message = "UNSOLVABLE_GRAPH") {
        super(message);
        this.name = "UNSOLVABLE_GRAPH";
    }
}

function ensureSet(map: BlockMap, key: string): Set<string> {
    if (!map.has(key)) {
        map.set(key, new Set());
    }
    return map.get(key)!;
}

function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getValidTargets(
    giverId: string,
    allIds: string[],
    blockMap: BlockMap,
    usedReceivers: Set<string>
): string[] {
    const blocked = blockMap.get(giverId) ?? new Set();
    return allIds.filter(id =>
        !blocked.has(id) && !usedReceivers.has(id)
    );
}

function backtrack(
    givers: string[],
    allIds: string[],
    blockMap: BlockMap,
    index: number,
    usedReceivers: Set<string>,
    current: Map<string, string>
): boolean {
    if (index === givers.length) {
        return true;
    }

    const giver = givers[index];
    const candidates = shuffle(
        getValidTargets(giver, allIds, blockMap, usedReceivers)
    );

    for (const candidate of candidates) {
        current.set(giver, candidate);
        usedReceivers.add(candidate);

        if (backtrack(givers, allIds, blockMap, index + 1, usedReceivers, current)) {
            return true;
        }

        current.delete(giver);
        usedReceivers.delete(candidate);
    }

    return false;
}

export function buildBlockMap(input: DrawAlgorithmInput): BlockMap {
    const { participants, restrictions, blockDependentDraw } = input;
    const blockMap: BlockMap = new Map();

    for (const p of participants) {
        ensureSet(blockMap, p.perfil.id);
    }

    for (const p of participants) {
        ensureSet(blockMap, p.perfil.id).add(p.perfil.id);
    }

    for (const r of restrictions) {
        const a = r.person_a_id;
        const b = r.person_b_id;

        ensureSet(blockMap, a).add(b);

        if (r.direction === "both_ways") {
            ensureSet(blockMap, b).add(a);
        }
    }

    if (blockDependentDraw) {
        const profilesByUser = new Map<string, string[]>();

        for (const p of participants) {
            const userId = p.perfil.user_id;

            if (!profilesByUser.has(userId)) {
                profilesByUser.set(userId, []);
            }

            profilesByUser.get(userId)!.push(p.perfil.id);
        }

        for (const [, profileIds] of profilesByUser) {
            if (profileIds.length <= 1) continue;

            for (const giver of profileIds) {
                for (const receiver of profileIds) {
                    if (giver !== receiver) {
                        ensureSet(blockMap, giver).add(receiver);
                    }
                }
            }
        }
    }

    return blockMap;
}

export function validatePossibility(
    participants: PartyParticipant[],
    blockMap: BlockMap
): void {
    const allIds = participants.map(p => p.perfil.id);

    for (const id of allIds) {
        const blocked = blockMap.get(id) ?? new Set();
        const possibleTargets = allIds.filter(x => !blocked.has(x));

        if (possibleTargets.length === 0) {
            throw new UnsolvableGraphError();
        }
    }
}

export function generateDraw(
    participants: PartyParticipant[],
    blockMap: BlockMap
): DrawPair[] {
    const allIds = participants.map(p => p.perfil.id);
    const givers = shuffle(allIds);
    const usedReceivers = new Set<string>();
    const result = new Map<string, string>();

    const success = backtrack(
        givers,
        allIds,
        blockMap,
        0,
        usedReceivers,
        result
    );

    if (!success) {
        throw new UnsolvableGraphError();
    }

    const pairs: DrawPair[] = [];

    for (const [giver, receiver] of result.entries()) {
        pairs.push({
            giver_profile_id: giver,
            receiver_profile_id: receiver
        });
    }

    return pairs;
}

export async function executeDraw(partyId: string) {
    if (!partyId) {
        throw new Error("partyId é obrigatório");
    }

    try {
        const baseUrl = process.env.EXPO_PUBLIC_FUNCTION_URL || "https://us-central1-dsmv-shakeit.cloudfunctions.net";
        const response = await axios.post(`${baseUrl}/executeDraw`, { partyId });
        return response.data;
    } catch (error: any) {
        console.error("Erro ao executar sorteio:", error);

        const errorData = error?.response?.data;
        if (
            errorData === "UNSOLVABLE_GRAPH" ||
            error?.response?.status === 422 ||
            (typeof errorData === "object" && errorData?.message === "UNSOLVABLE_GRAPH")
        ) {
            throw new Error("UNSOLVABLE_GRAPH");
        }

        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data ||
            error?.message ||
            "Erro ao executar sorteio"
        );
    }
}