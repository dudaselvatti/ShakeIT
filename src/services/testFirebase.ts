import { db } from "../config/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

export const checkFirebaseConnection = async () => {
  try {
    console.log("Verificando conexão com o Firebase...");

    if (!process.env.EXPO_PUBLIC_FIREBASE_API_KEY) {
      throw new Error("Erro: Variáveis de ambiente (.env) não carregadas!");
    }
    console.log("Variáveis de ambiente: OK");
    const q = query(collection(db, "teste"), limit(1));
    await getDocs(q);

    console.log("SUCESSO: O ShakeIT conectou com o Firebase!");
    return true;
  } catch (error: any) {
    console.error("ERRO DE CONEXÃO:");
    console.error("- Mensagem:", error.message);
    return false;
  }
};
