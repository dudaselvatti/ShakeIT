import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { PartyQRCode } from '../../components/PartyQRCode';
import { Button } from "../../components/Button";
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { usePartyAdminViewModel } from './PartyAdminViewModel';
import { styles } from './styles';

export const PartyAdminScreen = () => {
    const { partyName, partyCode, participantes, confirmadosCount, participantesTotal, headerTitle, handleSorteioPress } = usePartyAdminViewModel();
    return (
        <View style={styles.container}>
            <AppHeader headerTitle={headerTitle} />

            <View style={styles.contentBody}>
                <View style={styles.eventInfo}>
                    <Text style={styles.partyName}>{partyName}</Text>
                    <Text style={styles.codeLabel}>
                        Código: <Text style={styles.codeValue}>{partyCode}</Text>
                    </Text>
                </View>

                <PartyQRCode partyCode={partyCode} />

                <Text style={styles.participantesCount}>
                    Perfis confirmados ({confirmadosCount}/{participantesTotal})
                </Text>

                <View style={styles.flatListContainer}>
                    <FlatList
                        data={participantes}
                        keyExtractor={(item) => item.usuario.id.toString()}
                        renderItem={({ item }) => (
                            <ParticipanteCard participante={item} />
                        )}
                        initialNumToRender={participantes.length}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button 
                    title="Realizar Sorteio" 
                    onPress={handleSorteioPress}
                />
            </View>
        </View>
    );
}