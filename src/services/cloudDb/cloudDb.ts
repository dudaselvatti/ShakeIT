import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { Usuario } from "../../types/Usuario";
import { Party } from "../../types/Party";
import { usuariosMock } from "../../mocks/usuariosMock";
import { db } from '../../config/firebase';

const USERS_COLLECTION = "usuarios";

export async function seedUsuarios() {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));

    if (querySnapshot.empty) {
        console.log("Populando banco com usuários mock...");
        for (const user of usuariosMock) {
        await setDoc(doc(db, USERS_COLLECTION, user.id), user);
        }
    }
}

export async function getUsuarioById(id: string): Promise<Usuario | null> {
    const docRef = doc(db, USERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as Usuario;
    }
    return null;
}

export async function getUsuariosFromCloud(): Promise<Usuario[]> {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const usuarios: Usuario[] = [];
    
    querySnapshot.forEach((doc) => {
        usuarios.push(doc.data() as Usuario);
    });
    
    return usuarios;
}

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

export async function updateUsuario(id: string, data: Partial<Usuario>): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString(),
    });
}