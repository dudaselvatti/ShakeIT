import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PerfilSorteadoHeader } from './components/PerfilSorteadoHeader';
import { PerfilSorteadoContent } from './components/PerfilSorteadoContent';
import { usePerfilSorteadoViewModel } from './PerfilSorteadoViewModel';
import { styles } from './styles';
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";

export const PerfilSorteadoScreen = () => {
    const { participante, isLoading } = usePerfilSorteadoViewModel();
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
        </SafeAreaView>
    );
}