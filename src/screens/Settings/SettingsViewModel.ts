import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { resetUserPassword } from "../../services/cloud/User/UserDb";
import { UserForgotMyPasswordDTO } from "../../dto/User/UserForgotMyPasswordDTO";

export const useSettingsViewModel = (navigation: any) => {
    const [modalConfig, setModalConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        hideCancel?: boolean;
        type?: 'logout' | 'info' | 'delete_account';
    }>({ visible: false, title: '', message: '' });
    const [errors, setErrors] = useState({ passwordReset: "", emailReset: "", logout: "" });
    const [success, setSuccess] = useState({ passwordReset: "", emailReset: "", logout: "" });
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
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
            setErrors(prev => ({ ...prev, passwordReset: "Erro ao enviar o link de redefinição." }));
        } finally {
            setLoading(false);
        }
    };

    const handleAlterarEmail = async () => {
        setLoading(true);
        setErrors(prev => ({ ...prev, emailReset: "" }));
        setSuccess(prev => ({ ...prev, emailReset: "" }));

        try {
            // Simulated delay for email change logic
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess(prev => ({ ...prev, emailReset: "Instruções para alterar o e-mail foram enviadas." }));
        } catch(error: any) {
            setErrors(prev => ({ ...prev, emailReset: "Erro ao solicitar alteração de e-mail." }));
        } finally {
            setLoading(false);
        }
    };

    const handleSuporte = () => {
        import('react-native').then(({ Linking }) => {
            Linking.openURL("mailto:suporte@shakeit.app");
        });
    };

    const handleTermosUso = () => {
        setModalConfig({
            visible: true,
            title: "Termos de Uso",
            message: "Este aplicativo é um trabalho universitário desenvolvido por Ana Júlia, Maria Eduarda, Nathalie e Rodrigo (ECO - 2027) para a disciplina de Desenvolvimento Mobile.\n\nO ShakeIT utiliza a arquitetura SDD (Spec-Driven Development) e MVVM, e foi feito com o intuito de facilitar a criação de eventos e sorteios de forma interativa e divertida.",
            hideCancel: true,
            type: 'info'
        });
    };

    const handlePrivacidade = () => {
        setModalConfig({
            visible: true,
            title: "Política de Privacidade",
            message: "O ShakeIT utiliza o Firebase Firestore como banco de dados (Cloud NoSQL). Todos os dados armazenados (como perfis, dependentes e eventos) são utilizados exclusivamente para o funcionamento do sistema de sorteios e não são compartilhados com terceiros.",
            hideCancel: true,
            type: 'info'
        });
    };

    const handleExcluirConta = () => {
        setModalConfig({
            visible: true,
            title: "Excluir Conta",
            message: "Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.",
            type: 'delete_account',
            hideCancel: false
        });
    };

    const handleLogout = () => setModalConfig({
        visible: true,
        title: "Atenção!",
        message: "Tem certeza que deseja sair da conta?",
        type: 'logout',
        hideCancel: false
    });
    
    const cancelModal = () => setModalConfig(prev => ({ ...prev, visible: false }));
    const confirmModal = async () => {
        if (modalConfig.type === 'logout') {
            setModalConfig(prev => ({ ...prev, visible: false }));
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
                Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
                setErrors(prev => ({ ...prev, logout: "Erro ao sair da conta. Tente novamente." }));
            } finally {
                setLoading(false);
            }
        } else if (modalConfig.type === 'delete_account') {
            setModalConfig(prev => ({ ...prev, visible: false }));
            setLoading(true);
            try {
                if (usuarioAtual) {
                    const { deleteUserAccount } = await import('../../services/cloud/User/UserDb');
                    await deleteUserAccount(usuarioAtual.id);
                    await logoutContext();
                    if (navigation && typeof navigation.reset === "function") {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "Welcome" }],
                        });
                    }
                }
            } catch (error: any) {
                console.error("Erro ao excluir conta:", error);
                // Firebase might require recent auth to delete account
                if (error.code === 'auth/requires-recent-login') {
                    Toast.show({ type: "error", text1: "Reautenticação necessária", text2: "Por segurança, faça login novamente e tente excluir." });
                } else {
                    Toast.show({ type: "error", text1: "Oops!", text2: "Não foi possível excluir a conta." });
                }
            } finally {
                setLoading(false);
            }
        } else {
            setModalConfig(prev => ({ ...prev, visible: false }));
        }
    };

    return {
        modalConfig,
        isLoggedIn: !!usuarioAtual,
        errors,
        success,
        isLoading,
        handleAlterarSenha,
        handleAlterarEmail,
        handleSuporte,
        handleTermosUso,
        handlePrivacidade,
        handleExcluirConta,
        handleLogout,
        cancelModal,
        confirmModal,
    };
};
