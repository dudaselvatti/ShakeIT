import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { 
    createPartyInCloud, 
    getPartyFromCloud, 
    updatePartyDependentDrawFlagInCloud 
} from "./PartyDb";
import { gerarPartyCode } from "../../../utils/PartyCode/gerarPartyCode";

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn(),
    updateDoc: jest.fn(),
    getDoc: jest.fn(),
    serverTimestamp: jest.fn(() => "mocked-timestamp"),
}));

jest.mock("../../../config/firebase", () => ({
    db: {},
}));

jest.mock("../../../utils/PartyCode/gerarPartyCode", () => ({
    gerarPartyCode: jest.fn(() => "#MOCK123"),
}));

describe("PartyDb Service", () => {
    const mockDocId = "mock-generated-party-id";
    
    const mockPartyInput = {
        name: "Festa de Fim de Ano",
        event_date: "2026-12-25",
        min_value: 50,
        max_value: 150,
        admin_id: "ouefhgaijgnadpspiujfgsu",
    };

    const expectedPayload = {
        name: "Festa de Fim de Ano",
        event_date: "2026-12-25",
        min_value: 50,
        max_value: 150,
        invite_code: "#MOCK123",
        admin_id: "ouefhgaijgnadpspiujfgsu",
        status: "aguardando_sorteio",
        block_dependent_draw: false,
        allow_wishlist_changes_after_draw: false,
        created_at: "mocked-timestamp",
        updated_at: "mocked-timestamp",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createPartyInCloud", () => {
        it("deve criar uma party no Firestore com sucesso e retornar o objeto atualizado", async () => {
            const mockDocRef = { id: mockDocId };
            (addDoc as jest.Mock).mockResolvedValueOnce(mockDocRef);
            (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);
            
            (collection as jest.Mock).mockReturnValue("mock-collection-ref");
            (doc as jest.Mock).mockReturnValue("mock-doc-ref");

            const result = await createPartyInCloud(mockPartyInput);
            
            expect(collection).toHaveBeenCalledWith(expect.any(Object), "parties");
            expect(gerarPartyCode).toHaveBeenCalled();
            expect(addDoc).toHaveBeenCalledWith("mock-collection-ref", expectedPayload);
            expect(doc).toHaveBeenCalledWith(expect.any(Object), "parties", mockDocId);
            expect(updateDoc).toHaveBeenCalledWith("mock-doc-ref", { id: mockDocId });

            expect(result).toEqual({
                id: mockDocId,
                ...expectedPayload,
            });
        });

        it("deve propagar o erro caso o addDoc falhe", async () => {
            (addDoc as jest.Mock).mockRejectedValueOnce(new Error("Erro ao conectar com o Firestore"));

            await expect(createPartyInCloud(mockPartyInput)).rejects.toThrow("Erro ao conectar com o Firestore");
            
            expect(updateDoc).not.toHaveBeenCalled();
        });
    });

    describe("getPartyFromCloud", () => {
        it("deve retornar os dados da party corretamente se o documento existir", async () => {
            (doc as jest.Mock).mockReturnValue("mock-doc-ref");
            
            const mockSnapshot = {
                exists: () => true,
                id: mockDocId,
                data: () => ({
                    name: "Festa de Fim de Ano",
                    status: "aguardando_sorteio"
                })
            };
            (getDoc as jest.Mock).mockResolvedValueOnce(mockSnapshot);

            const result = await getPartyFromCloud(mockDocId);

            expect(doc).toHaveBeenCalledWith(expect.any(Object), "parties", mockDocId);
            expect(getDoc).toHaveBeenCalledWith("mock-doc-ref");
            expect(result).toEqual({
                id: mockDocId,
                name: "Festa de Fim de Ano",
                status: "aguardando_sorteio"
            });
        });

        it("deve retornar null se o documento não existir", async () => {
            (doc as jest.Mock).mockReturnValue("mock-doc-ref");
            
            const mockSnapshot = {
                exists: () => false
            };
            (getDoc as jest.Mock).mockResolvedValueOnce(mockSnapshot);

            const result = await getPartyFromCloud("id-inexistente");

            expect(result).toBeNull();
        });
    });

    describe("updatePartyDependentDrawFlagInCloud", () => {
        it("deve atualizar a flag block_dependent_draw e o timestamp de update", async () => {
            (doc as jest.Mock).mockReturnValue("mock-doc-ref");
            (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

            await updatePartyDependentDrawFlagInCloud(mockDocId, false);

            expect(doc).toHaveBeenCalledWith(expect.any(Object), "parties", mockDocId);
            expect(updateDoc).toHaveBeenCalledWith("mock-doc-ref", {
                block_dependent_draw: false,
                updated_at: "mocked-timestamp",
            });
        });
    });
});