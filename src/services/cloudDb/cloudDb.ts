import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { Usuario } from "../../types/Usuario";
import { Party } from "../../types/Party";
import { usuariosMock } from "../../mocks/usuariosMock";
import { db } from '../../config/firebase';

const USERS_COLLECTION = "users";

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

export async function storeUserInCloud(uid: string, dados: any) {
    const userRef = doc(db, USERS_COLLECTION, uid);
  
    await setDoc(userRef, {
        id: uid,
        email: dados.email,
        nome: dados.nome,
        genero: dados.genero,
        birth_date: dados.birth_date ? Timestamp.fromDate(dados.birth_date) : null,
        //height: dados.height,
        avatar_url: dados.avatar_url || "",
        bio: dados.bio || "",
        sizes: dados.sizes,

        //Não parece ser uma boa ideia colocar as opções padrão do usuário aqui, será bom revisar isto quando mais opções forem implementadas
        shake_enabled: true,
        dark_mode: false,
        notifications_enabled: true,

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
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