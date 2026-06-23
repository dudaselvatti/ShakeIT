import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { Party } from "../../../types/Party";
import { db } from '../../../config/firebase';
import { PartyCreationDTO } from "../../../dto/Party/PartyCreationDTO";
import { gerarPartyCode } from "../../../utils/PartyCode/gerarPartyCode";

export async function createPartyInCloud(party: PartyCreationDTO) {
    const partiesRef = collection(db, "parties");

    const payload = {
        name: party.name,
        event_date: party.event_date,
        min_value: party.min_value,
        max_value: party.max_value,
        invite_code: gerarPartyCode(),
        admin_id: party.admin_id,
        status: "aguardando_sorteio",
        block_dependent_draw: true,
        allow_wishlist_changes_after_draw: false,
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

export async function getPartyFromCloud(partyId: string): Promise<Party | null> {
    const partyDocRef = doc(db, "parties", partyId);
    const partySnapshot = await getDoc(partyDocRef);

    if (partySnapshot.exists()) {
        const data = partySnapshot.data();
        return {
            id: partySnapshot.id,
            ...data,
        } as Party;
    }

    return null;
}

export async function getPartiesByUserId(userId: string): Promise<Party[]> {
    const participantRef = collection(db, "PARTY_PARTICIPANT");
    const q = query(participantRef, where("perfil.user_id", "==", userId));
    const snapshot = await getDocs(q);
    const partyIds = new Set<string>();
    snapshot.forEach((document) => {
        const data = document.data();
        if (data.perfil?.party_id) {
            partyIds.add(data.perfil.party_id);
        }
    });
    const parties: Party[] = [];
    for (const partyId of partyIds) {
        const party =
            await getPartyFromCloud(partyId);
        if (party) {
            parties.push(party);
        }
    }
    return parties;
}

export async function updatePartyDependentDrawFlagInCloud(partyId: string, blockDependentDraw: boolean) {
    const partyDocRef = doc(db, "parties", partyId);
    await updateDoc(partyDocRef, {
        block_dependent_draw: blockDependentDraw,
        updated_at: serverTimestamp(),
    });
}