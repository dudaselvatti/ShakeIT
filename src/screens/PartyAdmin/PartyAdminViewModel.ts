import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";
import { getPartyFromCloud, realizarSorteioNoBackend } from '../../services/cloud/Party/PartyDb';
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
    const [isLoadingSorteio, setIsLoadingSorteio] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

    const handleSorteioPress = async () => {
        setIsLoadingSorteio(true);
        try {
            await realizarSorteioNoBackend(partyId);
            navigation.navigate('ShakeReveal');
        } catch (error: any) {
            console.error("Erro ao realizar sorteio:", error);
            const isUnsolvable = 
                error?.code === 'UNSOLVABLE_GRAPH' ||
                error?.message?.includes('UNSOLVABLE_GRAPH') ||
                error?.details === 'UNSOLVABLE_GRAPH' ||
                error?.details?.code === 'UNSOLVABLE_GRAPH';
            
            if (isUnsolvable) {
                setErrorMessage("Impossível realizar o sorteio! Você adicionou tantas restrições que o algoritmo não conseguiu encontrar uma combinação válida. Remova alguns bloqueios e tente novamente.");
            } else {
                setErrorMessage(error?.message || "Ocorreu um erro ao realizar o sorteio. Tente novamente.");
            }
            setIsErrorModalVisible(true);
        } finally {
            setIsLoadingSorteio(false);
        }
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalVisible(false);
        setErrorMessage("");
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
        isLoadingSorteio,
        isErrorModalVisible,
        errorMessage,
        handleCloseErrorModal,
    };
};