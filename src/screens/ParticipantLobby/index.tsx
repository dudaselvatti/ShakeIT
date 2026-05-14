import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { useParticipantLobbyViewModel } from './ParticipantLobbyViewModel';
import { styles } from './styles';

export const ParticipantLobbyScreen = () => {
    const { participantes, confirmadosCount, participantesTotal, handleBackPress } = useParticipantLobbyViewModel();

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
                    Participantes na Sala ({confirmadosCount}/{participantesTotal})
                </Text>

                <View style={styles.flatListContainer}>
                    <FlatList
                        data={participantes}
                        keyExtractor={(item) => item.usuario.id.toString()}
                        renderItem={({ item }) => (
                            <ParticipanteCard participante={item} />
                        )}
                        initialNumToRender={participantes.length}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>

            {/* Footer Global com navegação */}
            <AppFooter />
        </SafeAreaView>
    );
};
