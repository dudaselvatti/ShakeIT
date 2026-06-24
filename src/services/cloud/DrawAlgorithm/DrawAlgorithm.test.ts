import {
    buildBlockMap,
    validatePossibility,
    generateDraw,
    UnsolvableGraphError
} from "./DrawAlgorithm";
import { PartyParticipant } from "../../../types/PartyParticipant";

describe("DrawAlgorithm Unit Tests", () => {
    const participants: PartyParticipant[] = [
        {
            usuario: { id: "user-A", nome: "Ana", email: "ana@test.com" } as any,
            perfil: {
                id: "profile-A",
                user_id: "user-A",
                party_id: "party-1",
                participant_type: "user",
                participant_name: "Ana",
                participant_avatar: "avatarA",
                status: "confirmado",
                has_revealed_draw: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            has_revealed_draw: false
        },
        {
            usuario: { id: "user-B", nome: "Bruno", email: "bruno@test.com" } as any,
            perfil: {
                id: "profile-B",
                user_id: "user-B",
                party_id: "party-1",
                participant_type: "user",
                participant_name: "Bruno",
                participant_avatar: "avatarB",
                status: "confirmado",
                has_revealed_draw: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            has_revealed_draw: false
        },
        {
            usuario: { id: "user-C", nome: "Carlos", email: "carlos@test.com" } as any,
            perfil: {
                id: "profile-C",
                user_id: "user-C",
                party_id: "party-1",
                participant_type: "user",
                participant_name: "Carlos",
                participant_avatar: "avatarC",
                status: "confirmado",
                has_revealed_draw: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            has_revealed_draw: false
        }
    ];

    it("should perform a successful draw when there are no restrictions", () => {
        const blockMap = buildBlockMap({
            participants,
            restrictions: [],
            blockDependentDraw: false
        });

        expect(() => validatePossibility(participants, blockMap)).not.toThrow();
        const pairs = generateDraw(participants, blockMap);

        expect(pairs).toHaveLength(3);
        // Verify everyone draws exactly one person, and no one draws themselves
        const givers = pairs.map(p => p.giver_profile_id);
        const receivers = pairs.map(p => p.receiver_profile_id);

        expect(new Set(givers).size).toBe(3);
        expect(new Set(receivers).size).toBe(3);

        for (const pair of pairs) {
            expect(pair.giver_profile_id).not.toBe(pair.receiver_profile_id);
        }
    });

    it("should throw UnsolvableGraphError (UNSOLVABLE_GRAPH) in case of a mathematical deadlock", () => {
        // Deadlock scenario: 3 people where:
        // A blocks B, B blocks C, C blocks A (both ways)
        const restrictions = [
            {
                id: "r1",
                party_id: "party-1",
                person_a_id: "profile-A",
                person_b_id: "profile-B",
                direction: "both_ways" as const
            },
            {
                id: "r2",
                party_id: "party-1",
                person_a_id: "profile-B",
                person_b_id: "profile-C",
                direction: "both_ways" as const
            },
            {
                id: "r3",
                party_id: "party-1",
                person_a_id: "profile-C",
                person_b_id: "profile-A",
                direction: "both_ways" as const
            }
        ];

        const blockMap = buildBlockMap({
            participants,
            restrictions,
            blockDependentDraw: false
        });

        // validatePossibility or generateDraw should fail
        expect(() => {
            validatePossibility(participants, blockMap);
            generateDraw(participants, blockMap);
        }).toThrow(UnsolvableGraphError);
    });
});
