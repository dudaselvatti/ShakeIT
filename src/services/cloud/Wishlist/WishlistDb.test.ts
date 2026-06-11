import {
    getWishlistByOwner,
    addLikeTagToWishlist,
    removeLikeTagFromWishlist,
    addAvoidTagToWishlist,
    removeAvoidTagFromWishlist,
} from "./WishlistDb";
import { setDoc, getDocs, where, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    doc: jest.fn(() => ({ id: "mocked_wishlist_id" })),
    setDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    updateDoc: jest.fn(),
    arrayUnion: jest.fn((val) => ({ union: val })),
    arrayRemove: jest.fn((val) => ({ remove: val })),
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
        it("deve retornar null se a wishlist não existir", async () => {
            (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });
            const result = await getWishlistByOwner("owner123", "user");
            expect(result).toBeNull();
        });

        it("deve retornar a wishlist se existir", async () => {
            const mockDoc = {
                id: "wish123",
                data: () => ({
                    owner_id: "owner123",
                    owner_type: "user",
                    likes_tags: ["Chocolate"],
                    avoids_tags: ["Poeira"],
                }),
            };
            (getDocs as jest.Mock).mockResolvedValueOnce({
                empty: false,
                docs: [mockDoc],
            });

            const result = await getWishlistByOwner("owner123", "user");
            expect(result).toEqual({
                id: "wish123",
                owner_id: "owner123",
                owner_type: "user",
                likes_tags: ["Chocolate"],
                avoids_tags: ["Poeira"],
            });
            expect(where).toHaveBeenCalledWith("owner_id", "==", "owner123");
            expect(where).toHaveBeenCalledWith("owner_type", "==", "user");
        });
    });

    describe("addLikeTagToWishlist", () => {
        it("deve criar um novo documento de wishlist se não existir", async () => {
            (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

            await addLikeTagToWishlist("owner123", "user", "Futebol");

            expect(setDoc).toHaveBeenCalledWith(
                expect.any(Object),
                {
                    id: "mocked_wishlist_id",
                    owner_id: "owner123",
                    owner_type: "user",
                    likes_tags: ["Futebol"],
                    avoids_tags: [],
                    created_at: "2026-06-08T10:00:00.000Z",
                    updated_at: "2026-06-08T10:00:00.000Z",
                }
            );
        });

        it("deve atualizar com arrayUnion se a wishlist já existir", async () => {
            const mockDoc = {
                id: "wish123",
                data: () => ({
                    owner_id: "owner123",
                    owner_type: "user",
                    likes_tags: ["Chocolate"],
                    avoids_tags: [],
                }),
            };
            (getDocs as jest.Mock).mockResolvedValueOnce({
                empty: false,
                docs: [mockDoc],
            });

            await addLikeTagToWishlist("owner123", "user", "Futebol");

            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                {
                    likes_tags: { union: "Futebol" },
                    updated_at: "2026-06-08T10:00:00.000Z",
                }
            );
            expect(arrayUnion).toHaveBeenCalledWith("Futebol");
        });
    });

    describe("removeLikeTagFromWishlist", () => {
        it("deve remover a tag usando arrayRemove se a wishlist existir", async () => {
            const mockDoc = {
                id: "wish123",
                data: () => ({
                    owner_id: "owner123",
                    owner_type: "user",
                    likes_tags: ["Chocolate", "Futebol"],
                    avoids_tags: [],
                }),
            };
            (getDocs as jest.Mock).mockResolvedValueOnce({
                empty: false,
                docs: [mockDoc],
            });

            await removeLikeTagFromWishlist("owner123", "user", "Chocolate");

            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                {
                    likes_tags: { remove: "Chocolate" },
                    updated_at: "2026-06-08T10:00:00.000Z",
                }
            );
            expect(arrayRemove).toHaveBeenCalledWith("Chocolate");
        });
    });

    describe("addAvoidTagToWishlist", () => {
        it("deve criar um novo documento de wishlist se não existir", async () => {
            (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

            await addAvoidTagToWishlist("owner123", "user", "Poeira");

            expect(setDoc).toHaveBeenCalledWith(
                expect.any(Object),
                {
                    id: "mocked_wishlist_id",
                    owner_id: "owner123",
                    owner_type: "user",
                    likes_tags: [],
                    avoids_tags: ["Poeira"],
                    created_at: "2026-06-08T10:00:00.000Z",
                    updated_at: "2026-06-08T10:00:00.000Z",
                }
            );
        });

        it("deve atualizar com arrayUnion se a wishlist já existir", async () => {
            const mockDoc = {
                id: "wish123",
                data: () => ({
                    owner_id: "owner123",
                    owner_type: "user",
                    likes_tags: [],
                    avoids_tags: ["Mentiras"],
                }),
            };
            (getDocs as jest.Mock).mockResolvedValueOnce({
                empty: false,
                docs: [mockDoc],
            });

            await addAvoidTagToWishlist("owner123", "user", "Poeira");

            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                {
                    avoids_tags: { union: "Poeira" },
                    updated_at: "2026-06-08T10:00:00.000Z",
                }
            );
            expect(arrayUnion).toHaveBeenCalledWith("Poeira");
        });
    });

    describe("removeAvoidTagFromWishlist", () => {
        it("deve remover a tag usando arrayRemove se a wishlist existir", async () => {
            const mockDoc = {
                id: "wish123",
                data: () => ({
                    owner_id: "owner123",
                    owner_type: "user",
                    likes_tags: [],
                    avoids_tags: ["Poeira", "Mentiras"],
                }),
            };
            (getDocs as jest.Mock).mockResolvedValueOnce({
                empty: false,
                docs: [mockDoc],
            });

            await removeAvoidTagFromWishlist("owner123", "user", "Poeira");

            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                {
                    avoids_tags: { remove: "Poeira" },
                    updated_at: "2026-06-08T10:00:00.000Z",
                }
            );
            expect(arrayRemove).toHaveBeenCalledWith("Poeira");
        });
    });
});
