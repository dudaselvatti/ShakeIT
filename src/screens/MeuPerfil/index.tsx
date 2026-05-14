import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { styles } from './styles';
import { useMeuPerfilViewModel } from './MeuPerfilViewModel';

export const MeuPerfilScreen = () => {
    const {} = useMeuPerfilViewModel();

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle="Meu Perfil" showBackButton={false} showSettingsIcon={true} />
            <View style={styles.content}>
                <Text style={styles.text}>Meu Perfil - Em breve!</Text>
            </View>
            <AppFooter />
        </SafeAreaView>
    );
};
