import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
} from "firebase/firestore";
import { Party } from "../../../types/Party";
import { db } from '../../../config/firebase';

export async function createPartyInCloud(party: Omit<Party, "id">) {
    const partiesRef = collection(db, "parties");

    const payload = {
        name: party.name,
        event_date: party.event_date,
        min_value: party.min_value,
        max_value: party.max_value,
        invite_code: party.invite_code,
        admin_id: party.admin_id,
        status: party.status,
        block_dependent_draw: party.block_dependent_draw,
        allow_wishlist_changes_after_draw: party.allow_wishlist_changes_after_draw,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    };

    const docRef = await addDoc(partiesRef, payload);

    await updateDoc(doc(db, "parties", docRef.id), {
        id: docRef.id,
    });

    return {
        id: docRef.id,
        ...payload,
    };
}