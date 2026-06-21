import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from '../../../config/firebase';
import { DrawRestrictionCreationDTO } from "../../../dto/DrawRestriction/DrawRestrictionCreationDTO";
import { DrawRestrictionResponseDTO } from "../../../dto/DrawRestriction/DrawRestrictionResponseDTO";

export async function getDrawRestrictionsByPartyFromCloud(partyId: string): Promise<DrawRestrictionResponseDTO[]> {
    const restrictionRef = collection(db, "DRAW_RESTRICTION");
    const q = query(restrictionRef, where("party_id", "==", partyId));
    
    const querySnapshot = await getDocs(q);
    const restrictions: DrawRestrictionResponseDTO[] = [];
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        restrictions.push({
            id: doc.id,
            party_id: data.party_id,
            person_a_id: data.person_a_id,
            person_b_id: data.person_b_id,
            direction: data.direction,
        });
    });
    
    return restrictions;
}

export async function createDrawRestrictionInCloud(dto: DrawRestrictionCreationDTO): Promise<string> {
    const restrictionRef = collection(db, "DRAW_RESTRICTION");

    const payload = {
        party_id: dto.party_id,
        person_a_id: dto.person_a_id,
        person_b_id: dto.person_b_id,
        direction: dto.direction,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
    };

    const docRef = await addDoc(restrictionRef, payload);

    await updateDoc(doc(db, "DRAW_RESTRICTION", docRef.id), {
        id: docRef.id,
    });

    return docRef.id;
}

export async function deleteDrawRestrictionFromCloud(restrictionId: string): Promise<void> {
    const restrictionRef = doc(db, "DRAW_RESTRICTION", restrictionId);
    await deleteDoc(restrictionRef);
}