import { useState } from "react";

export const useSettingsViewModel = (navigation: any) => {
    const [isModalVisible, setModalVisible] = useState(false);
    
    const handleAlterarSenha = () => {/*A ser implementado com a T24*/};
    const handleLogout = () => setModalVisible(true);
    const cancelLogout = () => setModalVisible(false);
    const confirmLogout = () => {
        setModalVisible(false);
        navigation.navigate("Login");
    };

    return {
        isModalVisible,
        handleAlterarSenha,
        handleLogout,
        cancelLogout,
        confirmLogout,
    };
};
