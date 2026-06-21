import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";
import { getPartyFromCloud } from '../../services/cloud/Party/PartyDb';
import { useEffect, useState } from 'react';
import { Party } from '../../types/Party';

type RouteParams = {
  partyId: string;
};

export function usePartyAdminViewModel() {
    const route = useRoute();
    const navigation = useNavigation<any>();

    const { partyId } = route.params as RouteParams;

    const [party, setParty] = useState<Party | null>(null);
    const participantes = participantesMock;
    const confirmadosCount = participantes.filter(p => p.perfil.status === 'confirmado').length;
    const participantesTotal = participantes.length;
    const headerTitle = "Painel do Evento";

    useEffect(() => {
        async function fetchParty() {
            try {
                const cloudParty = await getPartyFromCloud(partyId);
                if (cloudParty) {
                    setParty(cloudParty);
                } else {
                    console.warn(`Festa com o ID ${partyId} não foi encontrada no banco.`);
                }
            } catch (error) {
                console.error("Erro ao buscar a festa no Firestore:", error);
            }
        }
        if (partyId) {
            fetchParty();
        }
    }, [partyId]);

    const partyName = party?.name ?? "Carregando...";
    const partyCode = party?.invite_code ?? "...";

    const handleNavigatePartyDrawRestrictions = () => {
        navigation.navigate("PartyDrawRestrictions", { partyId: partyId })
    }

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
        handleNavigatePartyDrawRestrictions,
        handleSorteioPress,
    };
};