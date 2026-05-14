import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";

export function useParticipantLobbyViewModel() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const handleBackPress = () => {
        navigation.navigate('Home');
    };

    // No futuro a partyId pode ser usada para buscar os dados via API
    // const { partyId } = route.params;

    const participantes = participantesMock;
    const confirmadosCount = participantes.filter(p => p.perfil.isConfirmado).length;
    const participantesTotal = participantes.length;

    return {
        participantes,
        confirmadosCount,
        participantesTotal,
        handleBackPress,
    };
}
