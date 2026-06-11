import { db } from "../../../config/firebase";
import { collection, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDocs, query, where } from "firebase/firestore";
import { Wishlist, OwnerType } from "../../../types/Wishlist";

const WISHLISTS_COLLECTION = "wishlists";

export async function getWishlistByOwner(ownerId: string): Promise<Wishlist | null> {
    const q = query(collection(db, WISHLISTS_COLLECTION), where("owner_id", "==", ownerId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as Wishlist;
    }
    return null;
}

export async function createWishlist(ownerId: string, ownerType: OwnerType): Promise<Wishlist> {
    const wishlistRef = doc(collection(db, WISHLISTS_COLLECTION));
    const newWishlist: Wishlist = {
        id: wishlistRef.id,
        owner_id: ownerId,
        owner_type: ownerType,
        likes_tags: [],
        avoids_tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    await setDoc(wishlistRef, newWishlist);
    return newWishlist;
}

export async function getOrCreateWishlist(ownerId: string, ownerType: OwnerType): Promise<Wishlist> {
    const existing = await getWishlistByOwner(ownerId);
    if (existing) {
        return existing;
    }
    return await createWishlist(ownerId, ownerType);
}

export async function addLikeTags(wishlistId: string, tags: string[]): Promise<void> {
    if (tags.length === 0) return;
    const wishlistRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    await updateDoc(wishlistRef, {
        likes_tags: arrayUnion(...tags),
        updated_at: new Date().toISOString(),
    });
}

export async function removeLikeTags(wishlistId: string, tags: string[]): Promise<void> {
    if (tags.length === 0) return;
    const wishlistRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    await updateDoc(wishlistRef, {
        likes_tags: arrayRemove(...tags),
        updated_at: new Date().toISOString(),
    });
}

export async function addAvoidTags(wishlistId: string, tags: string[]): Promise<void> {
    if (tags.length === 0) return;
    const wishlistRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    await updateDoc(wishlistRef, {
        avoids_tags: arrayUnion(...tags),
        updated_at: new Date().toISOString(),
    });
}

export async function removeAvoidTags(wishlistId: string, tags: string[]): Promise<void> {
    if (tags.length === 0) return;
    const wishlistRef = doc(db, WISHLISTS_COLLECTION, wishlistId);
    await updateDoc(wishlistRef, {
        avoids_tags: arrayRemove(...tags),
        updated_at: new Date().toISOString(),
    });
}
