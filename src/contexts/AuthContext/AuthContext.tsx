import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Usuario } from '../../types/Usuario';
import { getUserById, userLogout } from '../../services/cloud/User/UserDb';
import { auth } from '../../config/firebase';

interface AuthContextData {
  usuarioAtual: Usuario | null;
  isLoading: boolean;
  logoutContext: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
    const limparListener = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
            if (firebaseUser) {
                console.log("Usuário autenticado no Firebase Auth UID:", firebaseUser.uid);
                
                const dadosUsuario = await getUserById(firebaseUser.uid);
            
                if (dadosUsuario) {
                    setUsuarioAtual(dadosUsuario);
                } else {
                    console.warn("Usuário autenticado no Auth, mas não encontrado no Firestore.");
                    setUsuarioAtual(null);
                }
                } else {
                    setUsuarioAtual(null);
                }
            } catch (error) {
                console.error("Erro ao carregar dados do usuário logado:", error);
                setUsuarioAtual(null);
            } finally {
                setLoading(false);
            }
        });
        return () => limparListener();
    }, []);

    const logoutContext = async () => {
        await userLogout();
    };

    return (
        <AuthContext.Provider value={{ usuarioAtual, isLoading, logoutContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);