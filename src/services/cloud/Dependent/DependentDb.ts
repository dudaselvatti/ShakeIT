import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Dependent } from "../../../types/Dependent";

const DEPENDENTS_COLLECTION = "dependents";

// Converte um Timestamp do Firestore para string YYYY-MM-DD
function timestampToString(timestamp: any): string {
    if (!timestamp) return "";
    if (typeof timestamp === "string") return timestamp;
    
    let date: Date;
    if (timestamp instanceof Date) {
        date = timestamp;
    } else if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (timestamp.seconds !== undefined) {
        date = new Date(timestamp.seconds * 1000);
    } else {
        return "";
    }

    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Converte uma string YYYY-MM-DD para um Timestamp do Firestore
function stringToTimestamp(dateStr: string): Timestamp {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return Timestamp.fromDate(date);
}

export async function getDependentsByUser(userId: string): Promise<Dependent[]> {
    const q = query(collection(db, DEPENDENTS_COLLECTION), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    const dependents: Dependent[] = [];
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        dependents.push({
            ...data,
            id: doc.id,
            birth_date: timestampToString(data.birth_date),
        } as Dependent);
    });
    
    return dependents;
}

export async function storeDependentInCloud(
    dependent: Omit<Dependent, "id" | "created_at" | "updated_at"> & { id?: string }
): Promise<Dependent> {
    const id = dependent.id || doc(collection(db, DEPENDENTS_COLLECTION)).id;
    const docRef = doc(db, DEPENDENTS_COLLECTION, id);
    const now = new Date().toISOString();

    const dataToSave = {
        ...dependent,
        id,
        birth_date: stringToTimestamp(dependent.birth_date),
        created_at: now,
        updated_at: now,
    };

    await setDoc(docRef, dataToSave);

    return {
        ...dependent,
        id,
        created_at: now,
        updated_at: now,
    };
}

export async function updateDependentInCloud(id: string, data: Partial<Dependent>): Promise<void> {
    const docRef = doc(db, DEPENDENTS_COLLECTION, id);
    const now = new Date().toISOString();

    const dataToUpdate: any = {
        ...data,
        updated_at: now,
    };

    if (data.birth_date) {
        dataToUpdate.birth_date = stringToTimestamp(data.birth_date);
    }

    await updateDoc(docRef, dataToUpdate);
}

export async function deleteDependentFromCloud(id: string): Promise<void> {
    const docRef = doc(db, DEPENDENTS_COLLECTION, id);
    await deleteDoc(docRef);
}
