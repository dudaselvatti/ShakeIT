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
import { Switch, ScrollView } from 'react-native';

export const SettingsScreen = ({ navigation }: any) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const {
        modalConfig,
        errors,
        success,
        handleAlterarSenha,
        handleAlterarEmail,
        handleSuporte,
        handleTermosUso,
        handlePrivacidade,
        handleExcluirConta,
        handleLogout,
        cancelModal,
        confirmModal,
        isLoggedIn,
    } = useSettingsViewModel(navigation);
    const { isDark, toggleTheme, isScratchMode, toggleScratchMode } = useAppTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <AppHeader headerTitle="Configurações" showBackButton />
                <ScrollView 
                    style={styles.content}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.heading, { color: theme.colors.text }]}>Aparência</Text>
                    <View style={styles.optionsList}>
                        <SettingsOption
                            title="Modo Escuro"
                            activeOpacity={1}
                            rightElement={
                                <Switch 
                                    value={isDark} 
                                    onValueChange={toggleTheme} 
                                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                    thumbColor={isDark ? theme.colors.surface : theme.colors.surface}
                                />
                            }
                        />
                    </View>

                    <Text style={[styles.heading, { color: theme.colors.text, marginTop: 24 }]}>Geral</Text>
                    <View style={styles.optionsList}>
                        <SettingsOption
                            title="Raspadinha (Sem acelerômetro)"
                            activeOpacity={1}
                            rightElement={
                                <Switch 
                                    value={isScratchMode} 
                                    onValueChange={toggleScratchMode} 
                                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                    thumbColor={theme.colors.surface}
                                />
                            }
                        />
                        <SettingsOption
                            title="Falar com o Suporte"
                            onPress={handleSuporte}
                        />
                        <SettingsOption
                            title="Termos de Uso"
                            onPress={handleTermosUso}
                        />
                        <SettingsOption
                            title="Política de Privacidade"
                            onPress={handlePrivacidade}
                        />
                    </View>

                    {isLoggedIn && (
                        <>
                            <Text style={[styles.heading, { color: theme.colors.text, marginTop: 24 }]}>Conta</Text>
                            <View style={styles.optionsList}>
                                <SettingsOption
                                    title="Alterar Senha"
                                    onPress={handleAlterarSenha}
                                >
                                    {errors.passwordReset ? <Text style={styles.errorText}>{errors.passwordReset}</Text> : null}
                                    {success.passwordReset ? <Text style={styles.successText}>{success.passwordReset}</Text> : null}
                                </SettingsOption>

                                <SettingsOption
                                    title="Alterar E-mail"
                                    onPress={handleAlterarEmail}
                                >
                                    {errors.emailReset ? <Text style={styles.errorText}>{errors.emailReset}</Text> : null}
                                    {success.emailReset ? <Text style={styles.successText}>{success.emailReset}</Text> : null}
                                </SettingsOption>

                                <SettingsOption
                                    title="Excluir Conta"
                                    onPress={handleExcluirConta}
                                />
                            </View>
                        </>
                    )}
                </ScrollView>
                {isLoggedIn && (
                    <View style={styles.footer}>
                        <Button
                            title="Sair da Conta"
                            onPress={handleLogout}
                            variant="danger"
                        />
                    </View>
                )}
                <PopupModal
                    visible={modalConfig.visible}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    cancelText="Cancelar"
                    confirmText="Confirmar"
                    hideCancelButton={modalConfig.hideCancel}
                    onCancel={cancelModal}
                    onConfirm={confirmModal}
                />
            <AppFooter />
        </SafeAreaView>
    );
};
