import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { PartyQRCode } from '../../components/PartyQRCode';
import { Button } from "../../components/Button";
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { usePartyAdminViewModel } from './PartyAdminViewModel';
import { styles } from './styles';

export const PartyAdminScreen = () => {
    const {
        partyName,
        partyCode,
        participants,
        confirmadosCount,
        participantsTotal,
        headerTitle,
        isDrawing,
        handleNavigatePartyDrawRestrictions,
        handleSorteioPress
    } = usePartyAdminViewModel();
    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle={headerTitle} showSettingsIcon={true} />

            <View style={styles.contentBody}>
                <View style={styles.eventInfo}>
                    <Text style={styles.partyName}>{partyName}</Text>
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
                        keyExtractor={(item) => item.usuario.id.toString()}
                        renderItem={({ item }) => (
                            <ParticipanteCard participante={item} />
                        )}
                        initialNumToRender={participants.length}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button 
                    title="Configurar restrições de sorteio"
                    onPress={handleNavigatePartyDrawRestrictions}
                    variant="outline"
                />
                <Button
                    title={isDrawing ? "Realizando sorteio..." : "Realizar sorteio"}
                    disabled={isDrawing}
                    onPress={handleSorteioPress}
                />
            </View>

            <AppFooter />
        </SafeAreaView>
    );
}