import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";
import { getPartyFromCloud } from '../../services/cloud/Party/PartyDb';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Party } from '../../types/Party';
import { executeDraw } from '../../services/cloud/DrawAlgorithm/DrawAlgorithm';
import { PartyParticipant } from '../../types/PartyParticipant';
import { getParticipantsByPartyId, updatePartyParticipant } from '../../services/cloud/PartyParticipant/PartyParticipantDb';
import { useAuth } from '../../contexts/AuthContext/AuthContext';

type RouteParams = {
  partyId: string;
};

export function usePartyAdminViewModel() {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { usuarioAtual } = useAuth();

    const { partyId } = route.params as RouteParams;

    const [party, setParty] = useState<Party | null>(null);
    const [participants, setParticipants] = useState<PartyParticipant[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const confirmadosCount = participants.filter(p => p.perfil.status === 'confirmado').length;
    const participantsTotal = participants.length;
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

    useEffect(() => {
        async function fetchParticipants() {
          try {
            const partyParticipants = await getParticipantsByPartyId(partyId);
            setParticipants(partyParticipants);
          } catch (error) {
            console.error("Erro ao buscar participantes no Firestore:", error);
          }
        }
    
        if (partyId) {
          fetchParticipants();
        }
      }, [partyId]);

    const partyName = party?.name ?? "Carregando...";
    const partyCode = party?.invite_code ?? "...";

    const handleNavigatePartyDrawRestrictions = () => {
        navigation.navigate("PartyDrawRestrictions", { partyId: partyId })
    }

    const [isAddDependentVisible, setAddDependentVisible] = useState(false);

    const handleRemoveParticipant = async (participant: PartyParticipant) => {
        try {
            await updatePartyParticipant(participant.perfil.id, { 'perfil.status': 'removido' } as any);
            setParticipants(prev => prev.filter(p => p.perfil.id !== participant.perfil.id));
        } catch (error) {
            console.error("Erro ao remover participante:", error);
        }
    };

    const handleAddDependent = () => {
        setAddDependentVisible(true);
    };

    const handleSorteioPress = async () => {
        try {
            setIsDrawing(true);
            const result: any = await executeDraw(partyId);
            console.log("Sucesso", result.message ?? "Sorteio realizado com sucesso.");
            navigation.navigate("ShakeReveal", { partyId });
        } catch (error: any) {
            console.error("Erro no sorteio:", error);
            if (error.message === "UNSOLVABLE_GRAPH") {
                Alert.alert(
                    "Sorteio Impossível",
                    "Não há combinações possíveis para este sorteio devido às restrições configuradas (ou por ter apenas participantes do mesmo grupo familiar). Adicione mais pessoas ou remova restrições."
                );
            } else {
                Alert.alert("Erro", error.message || "Ocorreu um erro ao realizar o sorteio.");
            }
        } finally {
            setIsDrawing(false);
        }
    };

    const handleDependentAdded = () => {
        // Refresh participants
        getParticipantsByPartyId(partyId).then(setParticipants);
    };

    const handleNavigateToCreateDependent = () => {
        navigation.navigate('FormDependente');
    };

    return {
        usuarioAtual,
        partyId,
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
        handleNavigateToCreateDependent,
        handleNavigatePartyDrawRestrictions,
        handleSorteioPress,
    };
};