import {
    getWishlistByOwner,
    createWishlist,
    getOrCreateWishlist,
    addLikeTags,
    removeLikeTags,
    addAvoidTags,
    removeAvoidTags,
} from "./WishlistDb";
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDocs, query, where, collection } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    doc: jest.fn(() => ({ id: "mocked_wishlist_id" })),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    arrayUnion: jest.fn((...args) => ({ type: "arrayUnion", payload: args })),
    arrayRemove: jest.fn((...args) => ({ type: "arrayRemove", payload: args })),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
}));

jest.mock("../../../config/firebase", () => ({
    db: {},
}));

describe("WishlistDb - Testes Unitários", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers().setSystemTime(new Date("2026-06-08T10:00:00.000Z"));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("getWishlistByOwner", () => {
        it("deve retornar nulo se não encontrar a wishlist", async () => {
            (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

            const result = await getWishlistByOwner("user-1");

            expect(query).toHaveBeenCalled();
            expect(where).toHaveBeenCalledWith("owner_id", "==", "user-1");
            expect(getDocs).toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it("deve retornar a wishlist se ela existir", async () => {
            const mockWishlist = { id: "w-1", owner_id: "user-1", likes_tags: [] };
            (getDocs as jest.Mock).mockResolvedValueOnce({
                empty: false,
                docs: [{ data: () => mockWishlist }],
            });

            const result = await getWishlistByOwner("user-1");

            expect(result).toEqual(mockWishlist);
        });
    });

    describe("createWishlist", () => {
        it("deve criar e retornar uma nova wishlist", async () => {
            const result = await createWishlist("user-1", "user");

            expect(doc).toHaveBeenCalled();
            expect(setDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    id: "mocked_wishlist_id",
                    owner_id: "user-1",
                    owner_type: "user",
                    likes_tags: [],
                    avoids_tags: [],
                    created_at: "2026-06-08T10:00:00.000Z",
                    updated_at: "2026-06-08T10:00:00.000Z",
                })
            );
            expect(result.id).toBe("mocked_wishlist_id");
            expect(result.owner_id).toBe("user-1");
        });
    });

    describe("getOrCreateWishlist", () => {
        it("deve retornar a wishlist existente se encontrada", async () => {
            const mockWishlist = { id: "w-1", owner_id: "user-1", likes_tags: [] };
            (getDocs as jest.Mock).mockResolvedValueOnce({
                empty: false,
                docs: [{ data: () => mockWishlist }],
            });

            const result = await getOrCreateWishlist("user-1", "user");

            expect(result).toEqual(mockWishlist);
            expect(setDoc).not.toHaveBeenCalled();
        });

        it("deve criar uma nova wishlist se não encontrada", async () => {
            (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

            const result = await getOrCreateWishlist("user-1", "user");

            expect(setDoc).toHaveBeenCalled();
            expect(result.id).toBe("mocked_wishlist_id");
        });
    });

    describe("Operações de arrayUnion e arrayRemove", () => {
        it("addLikeTags deve adicionar tags usando arrayUnion", async () => {
            await addLikeTags("w-1", ["Futebol"]);

            expect(arrayUnion).toHaveBeenCalledWith("Futebol");
            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    likes_tags: { type: "arrayUnion", payload: ["Futebol"] },
                    updated_at: "2026-06-08T10:00:00.000Z",
                })
            );
        });

        it("addLikeTags não deve fazer nada se o array estiver vazio", async () => {
            await addLikeTags("w-1", []);
            expect(updateDoc).not.toHaveBeenCalled();
        });

        it("removeLikeTags deve remover tags usando arrayRemove", async () => {
            await removeLikeTags("w-1", ["Poeira"]);

            expect(arrayRemove).toHaveBeenCalledWith("Poeira");
            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    likes_tags: { type: "arrayRemove", payload: ["Poeira"] },
                })
            );
        });

        it("addAvoidTags deve adicionar tags usando arrayUnion", async () => {
            await addAvoidTags("w-1", ["Calor"]);

            expect(arrayUnion).toHaveBeenCalledWith("Calor");
            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    avoids_tags: { type: "arrayUnion", payload: ["Calor"] },
                })
            );
        });

        it("removeAvoidTags deve remover tags usando arrayRemove", async () => {
            await removeAvoidTags("w-1", ["Barulho"]);

            expect(arrayRemove).toHaveBeenCalledWith("Barulho");
            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    avoids_tags: { type: "arrayRemove", payload: ["Barulho"] },
                })
            );
        });
    });
});
