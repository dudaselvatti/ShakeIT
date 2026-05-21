import { 
  createPartyInCloud, 
  seedUsuarios, 
  getUsuarioById, 
  getUsuariosFromCloud 
} from "./cloudDb";
import { db } from "../../config/firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { Party } from "../../types/Party";
import { usuariosMock } from "../../mocks/usuariosMock";

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
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

describe("cloudDb", () => {
  const mockParty: Omit<Party, "id"> = {
    name: "Firma 2026",
    event_date: "25/06/2026",
    min_value: 10,
    max_value: 50,
    invite_code: "#INV123",
    admin_id: "1",
    status: "aguardando_sorteio",
    block_dependent_draw: false,
    allow_wishlist_changes_after_draw: false,
    created_at: "mockTimestamp",
    updated_at: "mockTimestamp"
  };

  const mockDocRef = { id: "mockDocId" };

  beforeEach(() => {
    jest.clearAllMocks();

    (collection as jest.Mock).mockReturnValue("mockCollectionRef");
    (addDoc as jest.Mock).mockResolvedValue({ id: "mockDocId" });
    (doc as jest.Mock).mockReturnValue("mockDocRefForUpdate");
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    (serverTimestamp as jest.Mock).mockReturnValue("mockTimestamp");
    (setDoc as jest.Mock).mockResolvedValue(undefined);
  });

  describe("createPartyInCloud", () => {
    it("deve criar uma party e retornar o payload com id", async () => {
      const result = await createPartyInCloud(mockParty);

      expect(collection).toHaveBeenCalledWith(db, "parties");
      expect(addDoc).toHaveBeenCalledWith("mockCollectionRef", {
        name: mockParty.name,
        event_date: mockParty.event_date,
        min_value: mockParty.min_value,
        max_value: mockParty.max_value,
        invite_code: mockParty.invite_code,
        admin_id: mockParty.admin_id,
        status: mockParty.status,
        block_dependent_draw: mockParty.block_dependent_draw,
        allow_wishlist_changes_after_draw: mockParty.allow_wishlist_changes_after_draw,
        created_at: mockParty.created_at,
        updated_at: mockParty.updated_at
      });

      expect(doc).toHaveBeenCalledWith(db, "parties", mockDocRef.id);
      expect(updateDoc).toHaveBeenCalledWith("mockDocRefForUpdate", { id: mockDocRef.id });

      expect(result).toEqual({
        id: mockDocRef.id,
        name: mockParty.name,
        event_date: mockParty.event_date,
        min_value: mockParty.min_value,
        max_value: mockParty.max_value,
        invite_code: mockParty.invite_code,
        admin_id: mockParty.admin_id,
        status: mockParty.status,
        block_dependent_draw: mockParty.block_dependent_draw,
        allow_wishlist_changes_after_draw: mockParty.allow_wishlist_changes_after_draw,
        created_at: mockParty.created_at,
        updated_at: mockParty.updated_at
      });
    });
  });

  describe("seedUsuarios", () => {
    it("deve popular usuários quando coleção estiver vazia", async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: true,
        docs: [],
      });

      await seedUsuarios();

      expect(collection).toHaveBeenCalledWith(db, "usuarios");
      expect(getDocs).toHaveBeenCalledWith("mockCollectionRef");
      expect(setDoc).toHaveBeenCalledTimes(usuariosMock.length);

      usuariosMock.forEach((usuario) => {
        expect(doc).toHaveBeenCalledWith(db, "usuarios", usuario.id.toString());
        expect(setDoc).toHaveBeenCalledWith("mockDocRefForUpdate", usuario);
      });
    });

    it("não deve popular usuários quando coleção já possuir dados", async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: "1" }],
      });

      await seedUsuarios();

      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe("getUsuarioById", () => {
    it("deve retornar o usuário quando o documento existir no Firestore", async () => {
      const mockUser = usuariosMock[0];
      
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockUser,
      });

      const result = await getUsuarioById("1");

      expect(doc).toHaveBeenCalledWith(db, "usuarios", "1");
      expect(getDoc).toHaveBeenCalledWith("mockDocRefForUpdate");
      expect(result).toEqual(mockUser);
    });

    it("deve retornar null se o documento não existir no Firestore", async () => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });

      const result = await getUsuarioById("id-inexistente");

      expect(result).toBeNull();
    });
  });

  describe("getUsuariosFromCloud", () => {
    it("deve retornar um array contendo todos os usuários mapeados do Firestore", async () => {
      const mockDocs = usuariosMock.map((u) => ({
        data: () => u,
      }));

      (getDocs as jest.Mock).mockResolvedValue({
        forEach: (callback: Function) => mockDocs.forEach((doc) => callback(doc)),
      });

      const result = await getUsuariosFromCloud();

      expect(collection).toHaveBeenCalledWith(db, "usuarios");
      expect(getDocs).toHaveBeenCalledWith("mockCollectionRef");
      expect(result).toEqual(usuariosMock);
      expect(result.length).toBe(usuariosMock.length);
    });
  });
});