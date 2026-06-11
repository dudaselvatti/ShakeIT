import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
 } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../../../config/firebase";
import { Usuario } from "../../../types/Usuario";
import { usuariosMock } from "../../../mocks/usuariosMock";
import { UserRegistrationDTO } from "../../../dto/User/UserRegistrationDTO";
import { UserLoginDTO } from "../../../dto/User/UserLoginDTO";
import { UserForgotMyPasswordDTO } from "../../../dto/User/UserForgotMyPasswordDTO";

const USERS_COLLECTION = "users";
const FOTO_PADRAO_URL = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"; //placeholder

export async function seedUsers() {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));

    if (querySnapshot.empty) {
        console.log("Populando banco com usuários mock...");
        for (const user of usuariosMock) {
        await setDoc(doc(db, USERS_COLLECTION, user.id), user);
        }
    }
}

export async function getUserById(id: string): Promise<Usuario | null> {
    const docRef = doc(db, USERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as Usuario;
    }
    return null;
}

export async function getUsersFromCloud(): Promise<Usuario[]> {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users: Usuario[] = [];
    
    querySnapshot.forEach((doc) => {
        users.push(doc.data() as Usuario);
    });
    
    return users;
}

export async function storeUserInCloud(dto: UserRegistrationDTO) {
    const userCredential = await createUserWithEmailAndPassword(auth, dto.email, dto.senha);
    const uid = userCredential.user.uid;
    const userRef = doc(db, USERS_COLLECTION, uid);

    let finalAvatarUrl = FOTO_PADRAO_URL;

    if (dto.avatar_url) {
        try {
            const url = dto.avatar_url;
            const blob: Blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", url, true);
                xhr.send(null);
            });
            
            const storageRef = ref(storage, `avatars/${uid}_avatar.jpg`);
            await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
            finalAvatarUrl = await getDownloadURL(storageRef);
        } catch (error: any) {
            console.error("Erro ao subir a imagem para o Storage, usando foto padrão:", error);
        }
    }
  
    await setDoc(userRef, {
        id: uid,
        email: dto.email.trim(),
        nome: dto.nome.trim(),
        genero: dto.genero.trim(),
        birth_date: Timestamp.fromDate(dto.birth_date),
        //height: dto.height,
        avatar_url: finalAvatarUrl,
        bio: dto.bio ? dto.bio.trim() : "",
        sizes: dto.sizes,

        //Não parece ser uma boa ideia colocar as opções padrão do usuário aqui, será bom revisar isto quando mais opções forem implementadas
        shake_enabled: true,
        dark_mode: false,
        notifications_enabled: true,

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    return userCredential.user;
}

export async function userLogin(dto: UserLoginDTO) {
    const loggedUser = await signInWithEmailAndPassword(auth, dto.email.trim(), dto.senha);
    return loggedUser;
}

export async function resetUserPassword(dto: UserForgotMyPasswordDTO): Promise<void> {
    await sendPasswordResetEmail(auth, dto.email.trim());
}

export async function userLogout(): Promise<void> {
    await signOut(auth);
}

export async function updateUsuario(id: string, data: Partial<Usuario>): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString(),
    });
}

export async function uploadUserAvatar(uid: string, avatarUri: string): Promise<string> {
    try {
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", avatarUri, true);
            xhr.send(null);
        });
        
        const storageRef = ref(storage, `avatars/${uid}_avatar.jpg`);
        await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
        return await getDownloadURL(storageRef);
    } catch (error: any) {
        console.error("Erro ao subir a imagem para o Storage:", error);
        throw error;
    }
}