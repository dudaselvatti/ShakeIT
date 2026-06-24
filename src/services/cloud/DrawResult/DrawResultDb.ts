import {
    collection,
    query,
    where,
    getDocs,
    limit
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { DrawResult } from "../../../types/DrawResult";

const DRAW_RESULT_COLLECTION = "DRAW_RESULT";

export async function getDrawResultByGiverProfileId(partyId: string, giverProfileId: string): Promise<DrawResult | null> {
    const drawRef = collection(db, DRAW_RESULT_COLLECTION);
    const q = query(
        drawRef,
        where("party_id", "==", partyId),
        where("giver_profile_id", "==", giverProfileId),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data()
    } as DrawResult;
}


export async function getDrawResultByReceiverProfile(partyId: string, receiverProfileId: string): Promise<DrawResult | null> {
    const drawRef = collection(db, DRAW_RESULT_COLLECTION);
    const q = query(
        drawRef,
        where("party_id", "==", partyId),
        where("receiver_profile_id", "==", receiverProfileId),
        limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];

    return {
        id: doc.id,
        ...doc.data()
    } as DrawResult;
}