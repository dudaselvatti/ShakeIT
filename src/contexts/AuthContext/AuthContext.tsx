import React, { createContext, useContext, useEffect, useState } from 'react';
import { Usuario } from '../../types/Usuario';
import { getUsuariosFromCloud, seedUsuarios } from '../../services/cloudDb/cloudDb';

interface AuthContextData {
  usuarioAtual: Usuario | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await seedUsuarios();

                const usuariosDoBanco = await getUsuariosFromCloud();

                const usuariosSemAdmin = usuariosDoBanco.filter(u => String(u.id) !== '1');
                
                if (usuariosSemAdmin.length > 0) {
                    const sorteado = usuariosSemAdmin[Math.floor(Math.random() * usuariosSemAdmin.length)];
                    setUsuarioAtual(sorteado);
                    console.log("Usuário identificado na sessão (via Banco de Dados):", sorteado.nome);
                } else {
                    console.warn("Nenhum usuário disponível para sorteio no banco.");
                }
            } catch (error) {
                console.error("Erro na identificação do usuário pelo banco:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ usuarioAtual, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);