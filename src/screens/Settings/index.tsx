import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { styles } from './styles';
import { useSettingsViewModel } from './SettingsViewModel';

export const SettingsScreen = () => {
    const {} = useSettingsViewModel();

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle="Configurações" showBackButton />
            <View style={styles.content}>
                <Text style={styles.text}>Configurações em breve!</Text>
            </View>
            <AppFooter />
        </SafeAreaView>
    );
};
