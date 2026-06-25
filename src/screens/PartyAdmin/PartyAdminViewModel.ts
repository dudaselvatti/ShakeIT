import Toast from 'react-native-toast-message';
import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";
import { listenToParty } from '../../services/cloud/Party/PartyDb';
import { useEffect, useState } from 'react';
import { Party } from '../../types/Party';
import { executeDraw } from '../../services/cloud/DrawAlgorithm/DrawAlgorithm';
import { PartyParticipant } from '../../types/PartyParticipant';
import { updatePartyParticipant, listenToParticipantsByPartyId } from '../../services/cloud/PartyParticipant/PartyParticipantDb';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { useMutation } from '@tanstack/react-query';

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

    useEffect(() => {
        if (!partyId) return;

        const unsubscribeParty = listenToParty(partyId, (cloudParty) => {
            if (cloudParty) setParty(cloudParty);
        });

        const unsubscribeParticipants = listenToParticipantsByPartyId(partyId, (partyParticipants) => {
            setParticipants(partyParticipants);
        });

        return () => {
            unsubscribeParty();
            unsubscribeParticipants();
        };
    }, [partyId]);

    const [isDrawing, setIsDrawing] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorModalTitle, setErrorModalTitle] = useState("");
    const [errorModalMessage, setErrorModalMessage] = useState("");

    const showError = (title: string, message: string) => {
        setErrorModalTitle(title);
        setErrorModalMessage(message);
        setErrorModalVisible(true);
    };

    const confirmadosCount = participants.filter(p => p.perfil.status === 'confirmado').length;
    const participantsTotal = participants.length;
    const headerTitle = "Painel do Evento";

    const [isEditModalVisible, setEditModalVisible] = useState(false);

    const partyName = party?.name ?? "Carregando...";
    const partyCode = party?.invite_code ?? "...";

    const handleNavigatePartyDrawRestrictions = () => {
        navigation.navigate("PartyDrawRestrictions", { partyId: partyId })
    }

    const [isAddDependentVisible, setAddDependentVisible] = useState(false);

    const removeParticipantMutation = useMutation({
        mutationFn: async (participant: PartyParticipant) => {
            await updatePartyParticipant(participant.perfil.id, { 'perfil.status': 'removido' } as any);
        },
        onSuccess: () => {
            // Atualizado via onSnapshot
        },
        onError: (error) => {
            console.error("Erro ao remover participante:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
        }
    });

    const handleRemoveParticipant = async (participant: PartyParticipant) => {
        removeParticipantMutation.mutate(participant);
    };

    const handleAddDependent = () => {
        setAddDependentVisible(true);
    };

    const handleSorteioPress = async () => {
        if (confirmadosCount < 3) {
            showError("Participantes insuficientes", "São necessários pelo menos 3 participantes confirmados para realizar o sorteio. Convide mais amigos!");
            return;
        }

        try {
            setIsDrawing(true);
            const result: any = await executeDraw(partyId);
            console.log("Sucesso", result.message ?? "Sorteio realizado com sucesso.");
            navigation.navigate("ShakeReveal", { partyId });
        } catch (error: any) {
            showError(
                "Impossível realizar o sorteio!",
                "As regras de restrições cadastradas impedem de realizar o sorteio. Ajuste elas e tente novamente."
            );
        } finally {
            setIsDrawing(false);
        }
    };

    const handleDependentAdded = () => {
        // Agora atualizado via onSnapshot
    };

    const handleNavigateToCreateDependent = () => {
        navigation.navigate('FormDependente');
    };

    return {
        usuarioAtual,
        partyId,
        partyName,
        partyCode,
        participants: [...participants].sort((a, b) => {
            const isA_CurrentUser = a.perfil.user_id === usuarioAtual?.id && a.perfil.participant_type === 'user';
            const isB_CurrentUser = b.perfil.user_id === usuarioAtual?.id && b.perfil.participant_type === 'user';
            if (isA_CurrentUser && !isB_CurrentUser) return -1;
            if (!isA_CurrentUser && isB_CurrentUser) return 1;

            const isA_MyDependent = a.perfil.user_id === usuarioAtual?.id && a.perfil.participant_type === 'dependent';
            const isB_MyDependent = b.perfil.user_id === usuarioAtual?.id && b.perfil.participant_type === 'dependent';
            if (isA_MyDependent && !isB_MyDependent) return -1;
            if (!isA_MyDependent && isB_MyDependent) return 1;

            const isA_Admin = a.perfil.user_id === party?.admin_id && a.perfil.participant_type === 'user';
            const isB_Admin = b.perfil.user_id === party?.admin_id && b.perfil.participant_type === 'user';
            if (isA_Admin && !isB_Admin) return -1;
            if (!isA_Admin && isB_Admin) return 1;

            const nameA = a.perfil.participant_name || a.usuario.nome || '';
            const nameB = b.perfil.participant_name || b.usuario.nome || '';
            return nameA.localeCompare(nameB);
        }),
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
        isEditModalVisible,
        setEditModalVisible,
        handleEditSave: () => {}, // Agora atualizado via onSnapshot
        party,
        errorModalVisible,
        setErrorModalVisible,
        errorModalTitle,
        errorModalMessage,
    };
};