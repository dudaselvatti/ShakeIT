import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";

export const usePartyAdminViewModel = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();

    const { partyName, partyCode } = route.params as {
        partyName: string;
        partyCode: string;
    };

    const participantes = participantesMock;
    const confirmadosCount = participantes.filter(p => p.perfil.isConfirmado).length;
    const participantesTotal = participantes.length;
    const headerTitle = "Painel do Evento";

    const handleSorteioPress = () => {
        navigation.navigate('ShakeReveal');
    };

    return {
        partyName,
        partyCode,
        participantes,
        confirmadosCount,
        participantesTotal,
        headerTitle,
        handleSorteioPress,
    };
};