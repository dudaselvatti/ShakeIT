import { createPartyInCloud } from "../../services/cloudDb/cloudDb";
import { db } from "../../config/firebase";
import { addDoc, collection, doc, updateDoc, serverTimestamp } from "firebase/firestore";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => "mockDb"),
  collection: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

describe("createPartyInCloud", () => {
  const mockParty = {
    name: "Firma 2026",
    eventDate: "25/06/2026",
    minPrice: 10,
    maxPrice: 50,
    inviteCode: "#INV123",
    idAdmin: 1,
    status: "Aguardando Sorteio",
  };

  const mockDocRef = { id: "mockDocId" };

  beforeEach(() => {
    jest.clearAllMocks();

    (collection as jest.Mock).mockReturnValue("mockCollectionRef");
    (addDoc as jest.Mock).mockResolvedValue({ id: "mockDocId" });
    (doc as jest.Mock).mockReturnValue("mockDocRefForUpdate");
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    (serverTimestamp as jest.Mock).mockReturnValue("mockTimestamp");
    });

  it("deve criar uma party e retornar o payload com id", async () => {
    const result = await createPartyInCloud(mockParty);

    expect(collection).toHaveBeenCalledWith(db, "parties");
    expect(addDoc).toHaveBeenCalledWith("mockCollectionRef", {
      name: mockParty.name,
      eventDate: mockParty.eventDate,
      minPrice: mockParty.minPrice,
      maxPrice: mockParty.maxPrice,
      inviteCode: mockParty.inviteCode,
      adminId: mockParty.idAdmin,
      status: mockParty.status,
      createdAt: "mockTimestamp",
    });
    expect(doc).toHaveBeenCalledWith(db, "parties", mockDocRef.id);
    expect(updateDoc).toHaveBeenCalledWith("mockDocRefForUpdate", { id: mockDocRef.id });

    expect(result).toEqual({
      id: mockDocRef.id,
      name: mockParty.name,
      eventDate: mockParty.eventDate,
      minPrice: mockParty.minPrice,
      maxPrice: mockParty.maxPrice,
      inviteCode: mockParty.inviteCode,
      adminId: mockParty.idAdmin,
      status: mockParty.status,
      createdAt: "mockTimestamp",
    });
  });
});