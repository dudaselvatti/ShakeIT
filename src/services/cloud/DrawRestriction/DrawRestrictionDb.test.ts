import { 
    collection, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    getDocs 
} from "firebase/firestore";
import { 
    getDrawRestrictionsByPartyFromCloud, 
    createDrawRestrictionInCloud, 
    deleteDrawRestrictionFromCloud 
} from "./DrawRestrictionDb";
import { DrawRestrictionCreationDTO } from "../../../dto/DrawRestriction/DrawRestrictionCreationDTO";

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    serverTimestamp: jest.fn(() => "mocked-timestamp"),
}));

jest.mock("../../../config/firebase", () => ({
    db: {},
}));

describe("DrawRestrictionDb Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getDrawRestrictionsByPartyFromCloud", () => {
        it("deve retornar a lista de restrições de sorteio de uma party com sucesso", async () => {
            const mockPartyId = "party-123";
            
            (collection as jest.Mock).mockReturnValue("mock-collection-ref");
            (where as jest.Mock).mockReturnValue("mock-where-clause");
            (query as jest.Mock).mockReturnValue("mock-query-ref");

            const mockDocs = [
                {
                    id: "restriction-1",
                    data: () => ({
                        party_id: mockPartyId,
                        person_a_id: "user-a",
                        person_b_id: "user-b",
                        direction: "unidirectional",
                    }),
                },
                {
                    id: "restriction-2",
                    data: () => ({
                        party_id: mockPartyId,
                        person_a_id: "user-c",
                        person_b_id: "user-d",
                        direction: "bidirectional",
                    }),
                }
            ];

            const mockQuerySnapshot = {
                forEach: (callback: Function) => mockDocs.forEach((doc) => callback(doc)),
            };

            (getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot);

            const result = await getDrawRestrictionsByPartyFromCloud(mockPartyId);

            expect(collection).toHaveBeenCalledWith(expect.any(Object), "DRAW_RESTRICTION");
            expect(where).toHaveBeenCalledWith("party_id", "==", mockPartyId);
            expect(query).toHaveBeenCalledWith("mock-collection-ref", "mock-where-clause");
            expect(getDocs).toHaveBeenCalledWith("mock-query-ref");

            expect(result).toEqual([
                {
                    id: "restriction-1",
                    party_id: mockPartyId,
                    person_a_id: "user-a",
                    person_b_id: "user-b",
                    direction: "unidirectional",
                },
                {
                    id: "restriction-2",
                    party_id: mockPartyId,
                    person_a_id: "user-c",
                    person_b_id: "user-d",
                    direction: "bidirectional",
                },
            ]);
        });

        it("deve retornar um array vazio se nenhuma restrição for encontrada", async () => {
            const mockQuerySnapshot = {
                forEach: (callback: Function) => {}, // Nenhuma iteração
            };
            (getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot);

            const result = await getDrawRestrictionsByPartyFromCloud("party-sem-restricoes");

            expect(result).toEqual([]);
        });
    });

    describe("createDrawRestrictionInCloud", () => {
        const mockDto: DrawRestrictionCreationDTO = {
            party_id: "party-123",
            person_a_id: "user-a",
            person_b_id: "user-b",
            direction: "unidirectional",
        };

        it("deve criar uma restrição, atualizar com o ID gerado e retornar o ID com sucesso", async () => {
            const mockDocId = "new-restriction-id";
            const mockDocRef = { id: mockDocId };

            (collection as jest.Mock).mockReturnValue("mock-collection-ref");
            (addDoc as jest.Mock).mockResolvedValueOnce(mockDocRef);
            (doc as jest.Mock).mockReturnValue("mock-doc-ref");
            (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

            const result = await createDrawRestrictionInCloud(mockDto);

            expect(collection).toHaveBeenCalledWith(expect.any(Object), "DRAW_RESTRICTION");
            expect(addDoc).toHaveBeenCalledWith("mock-collection-ref", {
                party_id: mockDto.party_id,
                person_a_id: mockDto.person_a_id,
                person_b_id: mockDto.person_b_id,
                direction: mockDto.direction,
                created_at: "mocked-timestamp",
                updated_at: "mocked-timestamp",
            });
            expect(doc).toHaveBeenCalledWith(expect.any(Object), "DRAW_RESTRICTION", mockDocId);
            expect(updateDoc).toHaveBeenCalledWith("mock-doc-ref", { id: mockDocId });
            
            expect(result).toBe(mockDocId);
        });

        it("deve propagar o erro caso o addDoc falhe", async () => {
            (addDoc as jest.Mock).mockRejectedValueOnce(new Error("Erro no Firestore"));

            await expect(createDrawRestrictionInCloud(mockDto)).rejects.toThrow("Erro no Firestore");
            expect(updateDoc).not.toHaveBeenCalled();
        });
    });

    describe("deleteDrawRestrictionFromCloud", () => {
        it("deve deletar a restrição com sucesso", async () => {
            const restrictionId = "restriction-to-delete";
            (doc as jest.Mock).mockReturnValue("mock-doc-ref");
            (deleteDoc as jest.Mock).mockResolvedValueOnce(undefined);

            await deleteDrawRestrictionFromCloud(restrictionId);

            expect(doc).toHaveBeenCalledWith(expect.any(Object), "DRAW_RESTRICTION", restrictionId);
            expect(deleteDoc).toHaveBeenCalledWith("mock-doc-ref");
        });

        it("deve propagar o erro caso o deleteDoc falhe", async () => {
            (deleteDoc as jest.Mock).mockRejectedValueOnce(new Error("Erro ao deletar"));

            await expect(deleteDrawRestrictionFromCloud("any-id")).rejects.toThrow("Erro ao deletar");
        });
    });
});