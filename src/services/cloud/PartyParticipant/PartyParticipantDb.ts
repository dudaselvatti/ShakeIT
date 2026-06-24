import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { PartyParticipant } from "../../../types/PartyParticipant";
import { Usuario } from "../../../types/Usuario";
import { participantesMock } from "../../../mocks/participantesMock";

const PARTY_PARTICIPANT_COLLECTION = "PARTY_PARTICIPANT";

export async function createPartyParticipant(partyId: string, usuario: Usuario): Promise<PartyParticipant> {
    const participantCollectionRef = collection(db, PARTY_PARTICIPANT_COLLECTION);
    const newParticipantDocRef = doc(participantCollectionRef); // Gera ID único para o perfil

    const novoParticipante: PartyParticipant = {
        usuario: usuario,
        perfil: {
            id: newParticipantDocRef.id,
            user_id: usuario.id,
            party_id: partyId,
            participant_type: "user",
            participant_name: usuario.nome,
            participant_avatar: usuario.avatar_url,
            status: "confirmado",
            has_revealed_draw: false,
            sizes: usuario.sizes || {},
            preferencias: {
                coisasQueAmo: usuario.interesses || [],
                melhorEvitar: usuario.evitar || []
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        has_revealed_draw: false
    };

    await setDoc(newParticipantDocRef, novoParticipante);
    return novoParticipante;
}

export async function getPartyParticipantByPerfilId(idPerfil: string): Promise<PartyParticipant | null> {
    const docRef = doc(db, PARTY_PARTICIPANT_COLLECTION, idPerfil);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as PartyParticipant;
    }
    return null;
}

export async function getParticipantsByPartyId(partyId: string): Promise<PartyParticipant[]> {
    const participantRef = collection(db, "PARTY_PARTICIPANT");
    const q = query(participantRef, where("perfil.party_id", "==", partyId));
    const querySnapshot = await getDocs(q);
    
    const participants: PartyParticipant[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data() as PartyParticipant;
        if (data.perfil.status === "confirmado" || data.perfil.status === "pendente") {
            participants.push(data);
        }
    });
    return participants;
}

export async function getPartyParticipantByUserIdAndPartyId(userId: string, partyId: string): Promise<PartyParticipant | null> {
    const participantRef = collection(db, PARTY_PARTICIPANT_COLLECTION);
    
    const q = query(
        participantRef, 
        where("perfil.user_id", "==", userId),
        where("perfil.party_id", "==", partyId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as PartyParticipant;
    }
    
    return null;
}

export async function updatePartyParticipant(idPerfil: string, data: Partial<PartyParticipant>): Promise<void> {
    const docRef = doc(db, PARTY_PARTICIPANT_COLLECTION, idPerfil);
    
    await updateDoc(docRef, {
        ...data,
        "perfil.updated_at": new Date().toISOString(),
    });
}

export async function getAmigoSecreto(id: string): Promise<any> {
    const participante = participantesMock.find(p => p.usuario.id === id || p.perfil.id === id);
    if (!participante) {
        throw new Error("Participante não foi encontrado!");
    }
    return participante;
}