import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { participantesMock } from "../../mocks/participantesMock";
import { AppHeader } from '../../components/AppHeader';
import { PartyQRCode } from '../../components/PartyQRCode';
import { Button } from "../../components/Button";
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { useRoute } from '@react-navigation/native';
import { styles } from './styles';

export const PartyAdminScreen = () => {
    const route = useRoute();

    const { partyName, partyCode } = route.params as {
        partyName: string;
        partyCode: string;
    };

    const confirmadosCount = participantesMock.filter(p => p.perfil.isConfirmado).length;
    const participantesTotal = participantesMock.length;
    const headerTitle = "Painel do Evento";

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
                    Perfis confirmados: ({confirmadosCount}/{participantesTotal})
                </Text>
                <View style={styles.flatListContainer}>
                    <FlatList
                        data={participantesMock}
                        keyExtractor={(item) => item.usuario.id.toString()}
                        renderItem={({ item }) => (
                            <ParticipanteCard participante={item} />
                        )}
                        initialNumToRender={participantesMock.length}
                    />
                </View>
            </View>
            <View style={styles.footer}>
                <Button title="Realizar Sorteio"/>
            </View>
        </View>
    );
}