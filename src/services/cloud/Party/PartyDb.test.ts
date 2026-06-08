import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { Party } from "../../../types/Party";
import { createPartyInCloud } from "./PartyDb";

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn(),
    updateDoc: jest.fn(),
    serverTimestamp: jest.fn(() => "mocked-timestamp"),
}));

jest.mock("../../../config/firebase", () => ({
    db: {},
}));
describe("createPartyInCloud", () => {
    const mockPartyInput: Omit<Party, "id"> = {
        name: "Festa de Fim de Ano",
        event_date: "2026-12-25",
        min_value: 50,
        max_value: 150,
        invite_code: "#IUHB74",
        admin_id: "ouefhgaijgnadpspiujfgsu",
        status: "aguardando_sorteio",
        block_dependent_draw: true,
        allow_wishlist_changes_after_draw: false,
        created_at: "mocked-timestamp",
        updated_at: "mocked-timestamp",
    };

    const mockDocId = "mock-generated-party-id";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar uma party no Firestore com sucesso e retornar o objeto atualizado", async () => {
        const mockDocRef = { id: mockDocId };
        (addDoc as jest.Mock).mockResolvedValueOnce(mockDocRef);
        (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);
        
        (collection as jest.Mock).mockReturnValue("mock-collection-ref");
        (doc as jest.Mock).mockReturnValue("mock-doc-ref");

        const result = await createPartyInCloud(mockPartyInput);
        
        expect(collection).toHaveBeenCalledWith(expect.any(Object), "parties");

        expect(addDoc).toHaveBeenCalledWith("mock-collection-ref", {
            ...mockPartyInput,
            created_at: "mocked-timestamp",
            updated_at: "mocked-timestamp",
        });

        expect(doc).toHaveBeenCalledWith(expect.any(Object), "parties", mockDocId);

        expect(updateDoc).toHaveBeenCalledWith("mock-doc-ref", {
            id: mockDocId,
        });

        expect(result).toEqual({
            id: mockDocId,
            ...mockPartyInput,
            created_at: "mocked-timestamp",
            updated_at: "mocked-timestamp",
        });
    });

    it("deve propagar o erro caso o addDoc falhe", async () => {
        (addDoc as jest.Mock).mockRejectedValueOnce(new Error("Erro ao conectar com o Firestore"));

        await expect(createPartyInCloud(mockPartyInput)).rejects.toThrow("Erro ao conectar com o Firestore");
        
        expect(updateDoc).not.toHaveBeenCalled();
    });
});