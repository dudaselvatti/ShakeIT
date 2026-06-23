import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";
import { getPartyFromCloud } from '../../services/cloud/Party/PartyDb';
import { useEffect, useState } from 'react';
import { Party } from '../../types/Party';
import { executeDraw } from '../../services/cloud/DrawAlgorithm/DrawAlgorithm';
import { PartyParticipant } from '../../types/PartyParticipant';
import { getParticipantsByPartyId } from '../../services/cloud/PartyParticipant/PartyParticipantDb';

type RouteParams = {
  partyId: string;
};

export function usePartyAdminViewModel() {
    const route = useRoute();
    const navigation = useNavigation<any>();

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

    const handleSorteioPress = async () => {
        try {
            setIsDrawing(true);
            const result: any = await executeDraw(partyId);
            console.log("Sucesso", result.message ?? "Sorteio realizado com sucesso.");
            navigation.navigate("ShakeReveal", { partyId });
        } catch (error: any) {
            const errorMessage = error?.message ?? "";
            if (errorMessage.includes("UNSOLVABLE_GRAPH")) {
                console.error("Sorteio matematicamente impossível: ", error)
                return;
            }
            console.error(error);
        } finally {
            setIsDrawing(false);
        }
    };

    return {
        partyName,
        partyCode,
        participants,
        confirmadosCount,
        participantsTotal,
        headerTitle,
        isDrawing,
        handleNavigatePartyDrawRestrictions,
        handleSorteioPress,
    };
};