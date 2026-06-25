import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { PartyQRCode } from '../../components/PartyQRCode';
import { Button } from "../../components/Button";
import { IconButton } from '../../components/IconButton';
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { AddDependentModal } from '../../components/AddDependentModal';
import { EditPartyModal } from '../../components/EditPartyModal';
import { usePartyAdminViewModel } from './PartyAdminViewModel';
import { createStyles } from './styles';
import { useAppTheme } from "../../contexts/ThemeContext";
import { formatDate } from '../../utils/Formatting/formatDate';
import { formatCurrency } from '../../utils/Formatting/formatCurrency';

export const PartyAdminScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const {
        partyName,
        partyCode,
        participants,
        confirmadosCount,
        participantsTotal,
        headerTitle,
        isDrawing,
        isAddDependentVisible,
        setAddDependentVisible,
        handleRemoveParticipant,
        handleAddDependent,
        handleDependentAdded,
        handleNavigatePartyDrawRestrictions,
        handleSorteioPress,
        usuarioAtual,
        partyId,
        handleNavigateToCreateDependent,
        isEditModalVisible,
        setEditModalVisible,
        handleEditSave,
        party
    } = usePartyAdminViewModel();
    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle={headerTitle} showSettingsIcon={true} />

            <View style={styles.contentBody}>
                <View style={styles.eventInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Text style={styles.partyName}>{partyName}</Text>
                        <Text style={[styles.codeValue, { fontSize: 16, paddingHorizontal: 8 }]}>
                            {partyCode}
                        </Text>
                        {party?.admin_id === usuarioAtual?.id && (
                            <IconButton 
                                iconName="edit-2" 
                                onPress={() => setEditModalVisible(true)} 
                                color={theme.colors.textLight} 
                                size={20}
                            />
                        )}
                    </View>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, padding: 8, width: '100%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../../assets/calendario.png')} style={{ width: 16, height: 16, marginRight: 6, tintColor: theme.colors.textLight }} />
                            <Text style={{ color: theme.colors.textLight, fontSize: 12 }}>{party?.event_date ? formatDate(party.event_date) : "..."}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../../assets/dinheiro.png')} style={{ width: 16, height: 16, marginRight: 6, tintColor: theme.colors.textLight }} />
                            <Text style={{ color: theme.colors.textLight, fontSize: 12 }}>R$ {party?.min_value ? formatCurrency(party.min_value) : "0"} - R$ {party?.max_value ? formatCurrency(party.max_value) : "0"}</Text>
                        </View>
                    </View>
                </View>

                <PartyQRCode partyCode={partyCode} />
                
                {party?.status === 'sorteio_revelado' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.success }}>
                        <Image source={require('../../../assets/check-confirmacao.png')} style={{ width: 20, height: 20, marginRight: 8, tintColor: theme.colors.success }} />
                        <Text style={{ color: theme.colors.text, fontWeight: 'bold', fontSize: 14, flex: 1 }}>Evento Revelado e Encerrado!</Text>
                    </View>
                )}

                {(() => {
                    if (!party) return null;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const eventDateObj = new Date(party.event_date + "T00:00:00");
                    const isPastDate = eventDateObj.getTime() < today.getTime();
                    
                    if (isPastDate && party.status !== 'sorteio_realizado' && party.status !== 'sorteio_revelado') {
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.danger }}>
                                <Image source={require('../../../assets/fechar.png')} style={{ width: 20, height: 20, marginRight: 8, tintColor: theme.colors.danger }} />
                                <Text style={{ color: theme.colors.danger, fontWeight: 'bold', fontSize: 14, flex: 1 }}>Evento Cancelado (Data expirada)</Text>
                            </View>
                        );
                    }
                    return null;
                })()}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 8 }}>
                    <Text style={[styles.participantsCount, { marginBottom: 0 }]}>
                        Perfis confirmados ({confirmadosCount}/{participantsTotal})
                    </Text>
                    {party?.admin_id === usuarioAtual?.id && (
                        <IconButton 
                            iconName="settings" 
                            onPress={handleNavigatePartyDrawRestrictions} 
                            color={theme.colors.textLight} 
                            size={20}
                        />
                    )}
                </View>

                <View style={styles.flatListContainer}>
                    <FlatList
                        data={participants}
                        keyExtractor={(item) => item.perfil.id}
                        renderItem={({ item }) => {
                            // O adm pode remover qualquer um, exceto ele mesmo
                            const isCurrentUser = item.perfil.user_id === usuarioAtual?.id && item.perfil.participant_type === 'user';
                            return (
                                <ParticipanteCard 
                                    participante={item} 
                                    onRemove={handleRemoveParticipant}
                                    showRemoveIcon={!isCurrentUser} // admin can remove anyone except themselves
                                />
                            );
                        }}
                        initialNumToRender={participants.length}
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

            <View style={styles.footer}>
                <Button style={styles.btnSorteio}
                    title={isDrawing ? "Realizando sorteio..." : "Realizar sorteio"}
                    disabled={isDrawing || confirmadosCount < 3}
                    onPress={handleSorteioPress}
                />
            </View>

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
            {party && (
                <EditPartyModal 
                    visible={isEditModalVisible}
                    onClose={() => setEditModalVisible(false)}
                    onSave={handleEditSave}
                    partyId={partyId}
                    initialData={{
                        name: party.name,
                        event_date: party.event_date,
                        min_value: party.min_value,
                        max_value: party.max_value
                    }}
                />
            )}
        </SafeAreaView>
    );
}