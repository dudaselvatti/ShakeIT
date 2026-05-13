import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Party } from "../../types/Party";
import { db } from '../../config/firebase'

export async function createPartyInCloud(party: Omit<Party, "id">) {
    const partiesRef = collection(db, "parties");

    const payload = {
        name: party.name,
        eventDate: party.eventDate,
        minPrice: party.minPrice,
        maxPrice: party.maxPrice,
        inviteCode: party.inviteCode,
        adminId: party.idAdmin,
        status: party.status,

        createdAt: serverTimestamp(),
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

