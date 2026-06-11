import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Wishlist, OwnerType } from "../../../types/Wishlist";

const WISHLISTS_COLLECTION = "wishlists";

export async function getWishlistByOwner(ownerId: string, ownerType: OwnerType): Promise<Wishlist | null> {
    const q = query(
        collection(db, WISHLISTS_COLLECTION),
        where("owner_id", "==", ownerId),
        where("owner_type", "==", ownerType)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return {
            ...docSnap.data(),
            id: docSnap.id,
        } as Wishlist;
    }
    return null;
}

export async function addLikeTagToWishlist(ownerId: string, ownerType: OwnerType, tag: string): Promise<void> {
    const existing = await getWishlistByOwner(ownerId, ownerType);
    const now = new Date().toISOString();
    if (existing) {
        const docRef = doc(db, WISHLISTS_COLLECTION, existing.id);
        await updateDoc(docRef, {
            likes_tags: arrayUnion(tag),
            updated_at: now,
        });
    } else {
        const docRef = doc(collection(db, WISHLISTS_COLLECTION));
        await setDoc(docRef, {
            id: docRef.id,
            owner_id: ownerId,
            owner_type: ownerType,
            likes_tags: [tag],
            avoids_tags: [],
            created_at: now,
            updated_at: now,
        });
    }
}

export async function removeLikeTagFromWishlist(ownerId: string, ownerType: OwnerType, tag: string): Promise<void> {
    const existing = await getWishlistByOwner(ownerId, ownerType);
    if (existing) {
        const docRef = doc(db, WISHLISTS_COLLECTION, existing.id);
        await updateDoc(docRef, {
            likes_tags: arrayRemove(tag),
            updated_at: new Date().toISOString(),
        });
    }
}

export async function addAvoidTagToWishlist(ownerId: string, ownerType: OwnerType, tag: string): Promise<void> {
    const existing = await getWishlistByOwner(ownerId, ownerType);
    const now = new Date().toISOString();
    if (existing) {
        const docRef = doc(db, WISHLISTS_COLLECTION, existing.id);
        await updateDoc(docRef, {
            avoids_tags: arrayUnion(tag),
            updated_at: now,
        });
    } else {
        const docRef = doc(collection(db, WISHLISTS_COLLECTION));
        await setDoc(docRef, {
            id: docRef.id,
            owner_id: ownerId,
            owner_type: ownerType,
            likes_tags: [],
            avoids_tags: [tag],
            created_at: now,
            updated_at: now,
        });
    }
}

export async function removeAvoidTagFromWishlist(ownerId: string, ownerType: OwnerType, tag: string): Promise<void> {
    const existing = await getWishlistByOwner(ownerId, ownerType);
    if (existing) {
        const docRef = doc(db, WISHLISTS_COLLECTION, existing.id);
        await updateDoc(docRef, {
            avoids_tags: arrayRemove(tag),
            updated_at: new Date().toISOString(),
        });
    }
}
