import { db } from "../../../config/firebase";
import { runTransaction, doc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { createNotification } from "../Notification/NotificationDb";

export class UnsolvableGraphError extends Error {
    constructor(message = "UNSOLVABLE_GRAPH") {
        super(message);
        this.name = "UNSOLVABLE_GRAPH";
    }
}

type BlockMap = Map<string, Set<string>>;

interface DrawPair {
    giver_profile_id: string;
    receiver_profile_id: string;
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
    return allIds.filter(id => !blocked.has(id) && !usedReceivers.has(id));
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
    const candidates = shuffle(getValidTargets(giver, allIds, blockMap, usedReceivers));
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

function buildBlockMap(
    participants: any[],
    restrictions: any[],
    blockDependentDraw: boolean
): BlockMap {
    const blockMap: BlockMap = new Map();
    for (const p of participants) ensureSet(blockMap, p.perfil.id);
    for (const p of participants) ensureSet(blockMap, p.perfil.id).add(p.perfil.id);
    for (const r of restrictions) {
        const a = r.person_a_id;
        const b = r.person_b_id;
        ensureSet(blockMap, a).add(b);
        if (r.direction === "both_ways") ensureSet(blockMap, b).add(a);
    }
    if (blockDependentDraw) {
        const profilesByUser = new Map<string, string[]>();
        for (const p of participants) {
            const userId = p.perfil.user_id;
            if (!profilesByUser.has(userId)) profilesByUser.set(userId, []);
            profilesByUser.get(userId)!.push(p.perfil.id);
        }
        for (const [, profileIds] of profilesByUser) {
            if (profileIds.length <= 1) continue;
            for (const giver of profileIds) {
                for (const receiver of profileIds) {
                    if (giver !== receiver) ensureSet(blockMap, giver).add(receiver);
                }
            }
        }
    }
    return blockMap;
}

function validatePossibility(participants: any[], blockMap: BlockMap): void {
    const allIds = participants.map(p => p.perfil.id);
    for (const id of allIds) {
        const blocked = blockMap.get(id) ?? new Set();
        const possibleTargets = allIds.filter(x => !blocked.has(x));
        if (possibleTargets.length === 0) throw new UnsolvableGraphError();
    }
}

function generateDraw(participants: any[], blockMap: BlockMap): DrawPair[] {
    const allIds = participants.map(p => p.perfil.id);
    const givers = shuffle(allIds);
    const usedReceivers = new Set<string>();
    const result = new Map<string, string>();
    const success = backtrack(givers, allIds, blockMap, 0, usedReceivers, result);
    if (!success) throw new UnsolvableGraphError();
    const pairs: DrawPair[] = [];
    for (const [giver, receiver] of result.entries()) {
        pairs.push({ giver_profile_id: giver, receiver_profile_id: receiver });
    }
    return pairs;
}

export async function executeDraw(partyId: string) {
    if (!partyId) throw new Error("partyId é obrigatório");

    try {
        const result = await runTransaction(db, async (transaction) => {
            const partyRef = doc(db, "parties", partyId);
            const partyDoc = await transaction.get(partyRef);
            
            if (!partyDoc.exists()) throw new Error("Party não encontrada");
            const partyData = partyDoc.data()!;
            if (partyData.status !== "aguardando_sorteio") throw new Error("Party não está pronta para sorteio");

            const blockDependentDraw = partyData.block_dependent_draw || false;

            // Transações requerem que as leituras venham antes das gravações. 
            // Em React Native, buscar collections grandes em transaction pode ser instável, 
            // mas como as restrições são pequenas, faremos a leitura padrão.
            const participantsQuery = query(collection(db, "PARTY_PARTICIPANT"), where("perfil.party_id", "==", partyId));
            const participantsSnapshot = await getDocs(participantsQuery);
            const participants = participantsSnapshot.docs
                .map(doc => doc.data())
                .filter(p => p.perfil?.status === "confirmado");

            if (participants.length < 2) throw new Error("Poucos participantes para sorteio");
            if (participants.length > 100) throw new Error("Limite de 100 participantes excedido");

            const restrictionsQuery = query(collection(db, "DRAW_RESTRICTION"), where("party_id", "==", partyId));
            const restrictionsSnapshot = await getDocs(restrictionsQuery);
            const restrictions = restrictionsSnapshot.docs.map(doc => doc.data());

            const blockMap = buildBlockMap(participants, restrictions, blockDependentDraw);
            validatePossibility(participants, blockMap);
            const pairs = generateDraw(participants, blockMap);

            const drawCollection = collection(db, "DRAW_RESULT");
            for (const pair of pairs) {
                const newDrawRef = doc(drawCollection);
                transaction.set(newDrawRef, {
                    id: newDrawRef.id,
                    party_id: partyId,
                    giver_profile_id: pair.giver_profile_id,
                    receiver_profile_id: pair.receiver_profile_id,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp()
                });
            }

            transaction.update(partyRef, {
                status: "sorteio_realizado",
                updated_at: serverTimestamp()
            });

            // Pass data out of transaction to notify later
            return {
                partyName: partyData.name,
                userIds: [...new Set(participants.map(p => p.perfil.user_id))] // Unique user IDs
            };
        });

        // Fire and forget notifications
        const notificationPromises = result.userIds.map(userId => 
            createNotification({
                user_id: userId,
                title: "Sorteio Realizado!",
                message: `O sorteio do evento ${result.partyName} foi realizado. Venha ver quem você tirou!`,
                type: 'raffle_complete',
                related_party_id: partyId
            })
        );
        Promise.all(notificationPromises).catch(err => console.error("Erro ao enviar notificações:", err));

        return { success: true, message: "Sorteio realizado com sucesso" };
    } catch (error: any) {
        if (error.name === "UNSOLVABLE_GRAPH" || error.message === "UNSOLVABLE_GRAPH") {
            throw new UnsolvableGraphError();
        }
        throw new Error(error.message || "Erro desconhecido ao executar sorteio");
    }
}
