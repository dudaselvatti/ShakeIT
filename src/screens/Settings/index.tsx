import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { createStyles } from './styles';
import { useSettingsViewModel } from './SettingsViewModel';
import { Button } from '../../components/Button';
import { PopupModal } from '../../components/PopupModal';
import { SettingsOption } from '../../components/SettingsOption';

import { useAppTheme } from '../../contexts/ThemeContext';
import { Switch } from 'react-native';

export const SettingsScreen = ({ navigation }: any) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const {
        isModalVisible,
        errors,
        success,
        handleAlterarSenha,
        handleLogout,
        cancelLogout,
        confirmLogout,
    } = useSettingsViewModel(navigation);
    const { isDark, toggleTheme, isScratchMode, toggleScratchMode } = useAppTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <AppHeader headerTitle="Configurações" showBackButton />
                <View style={styles.content}>
                    <Text style={[styles.heading, { color: theme.colors.text }]}>Aparência</Text>
                    <View style={styles.optionsList}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                            <Text style={{ fontSize: 16, color: theme.colors.text, fontWeight: '500' }}>Raspadinha (Sem acelerômetro)</Text>
                            <Switch 
                                value={isScratchMode} 
                                onValueChange={toggleScratchMode} 
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor={theme.colors.surface}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                            <Text style={{ fontSize: 16, color: theme.colors.text, fontWeight: '500' }}>Modo Escuro</Text>
                            <Switch 
                                value={isDark} 
                                onValueChange={toggleTheme} 
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor={isDark ? theme.colors.surface : theme.colors.surface}
                            />
                        </View>
                    </View>

                    <Text style={[styles.heading, { color: theme.colors.text, marginTop: 24 }]}>Conta</Text>
                    <View style={styles.optionsList}>

                        <SettingsOption
                            title="Alterar Senha"
                            iconName="lock"
                            onPress={handleAlterarSenha}
                        >
                            {errors.passwordReset ? <Text style={styles.errorText}>{errors.passwordReset}</Text> : null}
                            {success.passwordReset ? <Text style={styles.successText}>{success.passwordReset}</Text> : null}
                        </SettingsOption>
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
