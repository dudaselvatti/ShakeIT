import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { PartyQRCode } from '../../components/PartyQRCode';
import { Button } from "../../components/Button";
import { IconButton } from '../../components/IconButton';
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { AddDependentModal } from '../../components/AddDependentModal';
import { usePartyAdminViewModel } from './PartyAdminViewModel';
import { createStyles } from './styles';
import { useAppTheme } from "../../contexts/ThemeContext";

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
        handleNavigateToCreateDependent
    } = usePartyAdminViewModel();
    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle={headerTitle} showSettingsIcon={true} />

            <View style={styles.contentBody}>
                <View style={styles.eventInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Text style={styles.partyName}>{partyName}</Text>
                        <IconButton 
                            iconName="sliders" 
                            onPress={handleNavigatePartyDrawRestrictions} 
                            color={theme.colors.textLight} 
                            size={20}
                        />
                    </View>
                    <Text style={styles.codeLabel}>
                        Código: <Text style={styles.codeValue}>{partyCode}</Text>
                    </Text>
                </View>

                <PartyQRCode partyCode={partyCode} />

                <Text style={styles.participantsCount}>
                    Perfis confirmados ({confirmadosCount}/{participantsTotal})
                </Text>

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
                    disabled={isDrawing}
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
        </SafeAreaView>
    );
}