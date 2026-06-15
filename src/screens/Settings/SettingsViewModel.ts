import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { resetUserPassword } from "../../services/cloud/User/UserDb";
import { UserForgotMyPasswordDTO } from "../../dto/User/UserForgotMyPasswordDTO";

export const useSettingsViewModel = (navigation: any) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [errors, setErrors] = useState({ passwordReset: "", logout: "" });
    const [success, setSuccess] = useState({ passwordReset: "", logout: "" });
    const [isLoading, setLoading] = useState(true);

    const { usuarioAtual, logoutContext } = useAuth();
    
    const handleAlterarSenha = async () => {
        setLoading(true);
        setErrors(prev => ({ ...prev, passwordReset: "" }));
        setErrors(prev => ({ ...prev, passwordReset: "" }));

        if (!usuarioAtual) {
            setErrors(prev => ({ ...prev, passwordReset: "Falha ao obter o usuário logado." }));
            return;
        }
        try {
            const userForgotMyPasswordDTO: UserForgotMyPasswordDTO = {
                email: usuarioAtual.email
            }
            await resetUserPassword(userForgotMyPasswordDTO);
            setSuccess(prev => ({ ...prev, passwordReset: "O link de redefinição de senha foi enviado para o seu e-mail." }));
        } catch(error: any) {
            console.error("Erro ao enviar o link de redefinição:", error)
            setErrors(prev => ({ ...prev, passwordReset: "Erro ao enviar o link de redefinição." }));
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = () => setModalVisible(true);
    const cancelLogout = () => setModalVisible(false);
    const confirmLogout = async () => {
        setModalVisible(false);
        setLoading(true);
        setErrors(prev => ({ ...prev, logout: "" }));

        try {
            await logoutContext();
            if (navigation && typeof navigation.reset === "function") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Welcome" }],
                });
            }
        } catch (error: any) {
            console.error("Erro no logout:", error)
            setErrors(prev => ({ ...prev, logout: "Erro ao sair da conta. Tente novamente." }));
        } finally {
            setLoading(false);
        }
    };

    return {
        isModalVisible,
        errors,
        success,
        isLoading,
        handleAlterarSenha,
        handleLogout,
        cancelLogout,
        confirmLogout,
    };
};
