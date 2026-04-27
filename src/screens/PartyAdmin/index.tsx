import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { participantesMock } from "../../mocks/participantesMock";
import { AppHeader } from '../../components/AppHeader';
import { PartyQRCode } from '../../components/PartyQRCode';
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { useRoute } from '@react-navigation/native';
import { styles } from './styles';

export const PartyAdminScreen = () => {
    const route = useRoute();

    const { partyName, partyCode } = route.params as {
        partyName: string;
        partyCode: string;
    };

    const participantesCount = participantesMock.length;
    const participantesLimite = 20; //Por enquanto um valor fixo
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
                    Participantes ({participantesCount}/{participantesLimite})
                </Text>
                <View style={styles.flatListContainer}>
                    <FlatList
                        data={participantesMock}
                        keyExtractor={(item) => item.usuario.id.toString()}
                        renderItem={({ item }) => (
                            <ParticipanteCard participante={item} />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.btnSorteio} activeOpacity={1}>
                    <Text style={styles.btnSorteioText}>Realizar Sorteio</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}