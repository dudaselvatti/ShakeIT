import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { styles } from './styles';
import { useSettingsViewModel } from './SettingsViewModel';
import { Button } from '../../components/Button';
import { PopupModal } from '../../components/PopupModal';
import { SettingsOption } from '../../components/SettingsOption';

export const SettingsScreen = ({ navigation }: any) => {
    const {
        isModalVisible,
        handleAlterarSenha,
        handleLogout,
        cancelLogout,
        confirmLogout,
    } = useSettingsViewModel(navigation);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle="Configurações" showBackButton />
                <View style={styles.content}>
                    <Text style={styles.heading}>Conta</Text>
                    <View style={styles.optionsList}>
                        <SettingsOption
                            title="Alterar Senha"
                            onPress={handleAlterarSenha}
                        />
                    </View>
                </View>
                <View style={styles.footer}>
                    <Button
                        title="Sair da Conta"
                        onPress={handleLogout}
                        variant="danger"
                    />
                </View>
                <PopupModal
                    visible={isModalVisible}
                    title="Atenção!"
                    message="Tem certeza que deseja sair da conta?"
                    cancelText="Cancelar"
                    confirmText="Confirmar"
                    onCancel={cancelLogout}
                    onConfirm={confirmLogout}
                />
            <AppFooter />
        </SafeAreaView>
    );
};
