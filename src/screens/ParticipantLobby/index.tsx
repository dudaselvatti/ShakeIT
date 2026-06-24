import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { Button } from '../../components/Button';
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { AddDependentModal } from '../../components/AddDependentModal';
import { PopupModal } from '../../components/PopupModal';
import { useParticipantLobbyViewModel } from './ParticipantLobbyViewModel';
import { createStyles } from './styles';
import { useAppTheme } from "../../contexts/ThemeContext";

export const ParticipantLobbyScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { 
        partyId,
        usuarioAtual,
        participantes, 
        confirmadosCount, 
        participantesTotal, 
        handleBackPress,
        isAddDependentVisible,
        setAddDependentVisible,
        handleRemoveParticipant,
        handleAddDependent,
        handleDependentAdded,
        isCurrentUserPendente,
        isConfirmModalVisible,
        setConfirmModalVisible,
        isConfirming,
        handleConfirmPresence,
        handleNavigateToCreateDependent,
    } = useParticipantLobbyViewModel();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Global com botão de voltar para a Home e com configurações */}
            <AppHeader 
                headerTitle="Sala de Espera" 
                showBackButton={true} 
                onBackPress={handleBackPress}
                showSettingsIcon={true} 
            />

            <View style={styles.contentBody}>
                <View style={styles.statusHighlight}>
                    <Text style={styles.statusText}>
                        Aguardando o organizador iniciar o sorteio...
                    </Text>
                </View>

                <Text style={styles.participantesCount}>
                    Participantes ({confirmadosCount}/{participantesTotal})
                </Text>

                <View style={styles.flatListContainer}>
                    <FlatList
                        data={participantes}
                        keyExtractor={(item) => item.perfil.id}
                        renderItem={({ item }) => {
                            const isCurrentUser = item.perfil.user_id === usuarioAtual?.id && item.perfil.participant_type === 'user';
                            const isOwner = item.perfil.user_id === usuarioAtual?.id;
                            // Um participante comum só pode remover seus dependentes
                            const canRemove = isOwner && item.perfil.participant_type === 'dependent';
                            return (
                                <ParticipanteCard 
                                    participante={item} 
                                    onRemove={handleRemoveParticipant}
                                    showRemoveIcon={canRemove} 
                                />
                            );
                        }}
                        initialNumToRender={participantes.length}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => (
                            <Button 
                                title="+ Adicionar Dependente" 
                                variant="outline" 
                                onPress={handleAddDependent} 
                                style={{ marginTop: 16, marginBottom: 30 }}
                            />
                        )}
                    />
                </View>
            </View>

            {/* Footer Global com navegação */}
            {isCurrentUserPendente && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                    <Button 
                        title="Confirmar Presença" 
                        onPress={() => setConfirmModalVisible(true)} 
                    />
                </View>
            )}
            <AppFooter />
            <AddDependentModal 
                visible={isAddDependentVisible}
                partyId={partyId}
                onClose={() => setAddDependentVisible(false)}
                onDependentAdded={() => {
                    setAddDependentVisible(false);
                    handleDependentAdded();
                }}
                onNavigateToCreate={handleNavigateToCreateDependent}
            />
            <PopupModal 
                visible={isConfirmModalVisible}
                title="Confirmar Presença"
                message="Ao confirmar presença, os dados atuais do seu perfil e dos seus dependentes serão usados para o sorteio. Alterações feitas depois disso não farão efeito. Deseja lockar os dados agora?"
                cancelText="Cancelar"
                confirmText={isConfirming ? "Confirmando..." : "Sim, confirmar"}
                onCancel={() => setConfirmModalVisible(false)}
                onConfirm={handleConfirmPresence}
            />
        </SafeAreaView>
    );
};
