import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { Button } from '../../components/Button';
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { AddDependentModal } from '../../components/AddDependentModal';
import { PopupModal } from '../../components/PopupModal';
import { PartyQRCode } from '../../components/PartyQRCode';
import { formatDate } from '../../utils/Formatting/formatDate';
import { formatCurrency } from '../../utils/Formatting/formatCurrency';
import { useParticipantLobbyViewModel } from './ParticipantLobbyViewModel';
import { createStyles } from './styles';
import { useAppTheme } from "../../contexts/ThemeContext";

export const ParticipantLobbyScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { 
        partyId,
        party,
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
        isLeaveModalVisible,
        setLeaveModalVisible,
        isConfirming,
        handleConfirmPresence,
        handleLeaveEvent,
        handleNavigateToCreateDependent,
        handleNavigateToResults,
        errorModalVisible,
        errorModalMessage,
        setErrorModalVisible,
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
                        {party?.status === 'aguardando_sorteio' 
                            ? "Aguardando o organizador iniciar o sorteio..." 
                            : party?.status === 'sorteio_realizado' 
                                ? "O sorteio foi realizado!" 
                                : "O resultado foi revelado!"}
                    </Text>
                </View>

                {(party?.status === 'sorteio_realizado' || party?.status === 'sorteio_revelado') && (
                    <Button 
                        title="Ver Sorteio"
                        onPress={handleNavigateToResults}
                        style={{ marginBottom: 16 }}
                    />
                )}

                {party && (
                    <View style={{ flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}>
                        <View style={{ flex: 1, paddingRight: 16, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 22, fontWeight: 'bold', flexShrink: 1, color: theme.colors.text }} numberOfLines={2}>{party.name}</Text>
                            </View>
                            
                            <View style={{ marginTop: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                    <Image source={require('../../../assets/calendario.png')} style={{ width: 14, height: 14, marginRight: 6, tintColor: theme.colors.textLight }} />
                                    <Text style={{ color: theme.colors.textLight, fontSize: 13 }}>{party.event_date ? formatDate(party.event_date) : "..."}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require('../../../assets/dinheiro.png')} style={{ width: 14, height: 14, marginRight: 6, tintColor: theme.colors.textLight }} />
                                    <Text style={{ color: theme.colors.textLight, fontSize: 13 }}>R$ {party.min_value ? formatCurrency(party.min_value) : "0"} - R$ {party.max_value ? formatCurrency(party.max_value) : "0"}</Text>
                                </View>
                            </View>
                            
                            <View style={{ marginTop: 16, alignSelf: 'flex-start', backgroundColor: theme.colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.primary }}>
                                <Text selectable={true} style={{ fontSize: 16, color: theme.colors.primary, letterSpacing: 2, fontWeight: 'bold' }}>
                                    {party.invite_code}
                                </Text>
                            </View>
                        </View>
                        
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <PartyQRCode partyCode={party.invite_code} size={90} />
                            <Text style={{ fontSize: 10, color: theme.colors.textLight, marginTop: 8 }}>Ler QR Code</Text>
                        </View>
                    </View>
                )}

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
                            const isAdmin = item.perfil.user_id === party?.admin_id && item.perfil.participant_type === 'user';
                            // Um participante comum só pode remover seus dependentes
                            const canRemove = isOwner && item.perfil.participant_type === 'dependent';
                            return (
                                <ParticipanteCard 
                                    participante={item} 
                                    onRemove={handleRemoveParticipant}
                                    showRemoveIcon={canRemove} 
                                    isCurrentUser={isCurrentUser}
                                    isAdmin={isAdmin}
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
            <View style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}>
                {isCurrentUserPendente && (
                    <Button 
                        title="Confirmar Presença" 
                        onPress={() => setConfirmModalVisible(true)} 
                    />
                )}
                {party?.admin_id !== usuarioAtual?.id && (
                    <Button 
                        title="Sair do Evento" 
                        variant="outline"
                        onPress={() => setLeaveModalVisible(true)} 
                    />
                )}
            </View>
            <AppFooter />
            <AddDependentModal 
                visible={isAddDependentVisible}
                partyId={partyId}
                adminId={party?.admin_id}
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
            <PopupModal 
                visible={isLeaveModalVisible}
                title="Sair do Evento"
                message="Você tem certeza que deseja sair deste evento? Seus dependentes também serão removidos."
                cancelText="Cancelar"
                confirmText={isConfirming ? "Saindo..." : "Sim, sair"}
                onCancel={() => setLeaveModalVisible(false)}
                onConfirm={handleLeaveEvent}
            />
            <PopupModal
                visible={errorModalVisible}
                title="Oops!"
                message={errorModalMessage}
                confirmText="OK"
                hideCancelButton={true}
                onConfirm={() => setErrorModalVisible(false)}
                onCancel={() => setErrorModalVisible(false)}
            />
        </SafeAreaView>
    );
};
