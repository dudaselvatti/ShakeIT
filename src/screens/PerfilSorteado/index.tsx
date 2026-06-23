import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ScreenCapture from 'expo-screen-capture';

import { PopupModal } from '../../components/PopupModal';
import { PerfilSorteadoHeader } from './components/PerfilSorteadoHeader';
import { PerfilSorteadoContent } from './components/PerfilSorteadoContent';
import { usePerfilSorteadoViewModel } from './PerfilSorteadoViewModel';
import { createStyles } from './styles';
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { useAppTheme } from "../../contexts/ThemeContext";

export const PerfilSorteadoScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { participante, isLoading } = usePerfilSorteadoViewModel();
    const [isScreenshotModalVisible, setIsScreenshotModalVisible] = useState(false);

    useEffect(() => {
        const subscription = ScreenCapture.addScreenshotListener(() => {
            setIsScreenshotModalVisible(true);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    if (isLoading || !participante) {
        return null;
    }
    const { usuario, perfil } = participante;
    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle="Perfil Sorteado" showBackButton={true} showSettingsIcon={true} />
            <PerfilSorteadoHeader
                fotoUrl={usuario.avatar_url}
                nome={usuario.nome}
                dataDeNascimento={usuario.birth_date}
                genero={usuario.genero}
            />
            <ScrollView>
                <PerfilSorteadoContent
                    medidas={perfil.sizes || {}}
                    preferencias={perfil.preferencias || {}}
                />
            </ScrollView>
            <AppFooter />

            <PopupModal
                visible={isScreenshotModalVisible}
                title="Atenção! 🤫"
                message="É um amigo SECRETO, sabia? Não devia ficar tirando print do perfil alheio!"
                cancelText="Fechar"
                confirmText="Foi mal!"
                onCancel={() => setIsScreenshotModalVisible(false)}
                onConfirm={() => setIsScreenshotModalVisible(false)}
            />
        </SafeAreaView>
    );
}