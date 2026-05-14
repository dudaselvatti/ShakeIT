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
        await setDoc(doc(db, USERS_COLLECTION, user.id.toString()), user);
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