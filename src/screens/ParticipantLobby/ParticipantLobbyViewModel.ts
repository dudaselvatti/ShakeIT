
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { PartyParticipant } from '../../types/PartyParticipant';
import { getParticipantsByPartyId, updatePartyParticipant, confirmPresenceInParty, listenToParticipantsByPartyId } from '../../services/cloud/PartyParticipant/PartyParticipantDb';
import { getPartyFromCloud, listenToParty } from '../../services/cloud/Party/PartyDb';
import { Party } from '../../types/Party';
import { useAuth } from '../../contexts/AuthContext/AuthContext';

type RouteParams = {
  partyId: string;
};

export function useParticipantLobbyViewModel() {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { usuarioAtual } = useAuth();
    const { partyId } = route.params as RouteParams;
    
    const [participantes, setParticipantes] = useState<PartyParticipant[]>([]);
    const [isAddDependentVisible, setAddDependentVisible] = useState(false);
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');
    const [party, setParty] = useState<Party | null>(null);

    useEffect(() => {
        if (!partyId) return;

        const unsubscribeParty = listenToParty(partyId, (cloudParty) => {
            if (cloudParty) setParty(cloudParty);
        });

        const unsubscribeParticipants = listenToParticipantsByPartyId(partyId, (partyParticipants) => {
            setParticipantes(partyParticipants);
        });

        return () => {
            unsubscribeParty();
            unsubscribeParticipants();
        };
    }, [partyId]);

    const currentUserParticipant = participantes.find(
        (p) => p.perfil.user_id === usuarioAtual?.id && p.perfil.participant_type === "user"
    );
    const isCurrentUserPendente = currentUserParticipant?.perfil.status === "pendente";

    const handleConfirmPresence = async () => {
        if (!usuarioAtual) return;
        setIsConfirming(true);
        try {
            await confirmPresenceInParty(partyId, usuarioAtual);
            setConfirmModalVisible(false);
        } catch (error) {
            console.error("Erro ao confirmar presença:", error);
            setErrorModalMessage("Falha ao confirmar presença.");
            setErrorModalVisible(true);
        } finally {
            setIsConfirming(false);
        }
    };

    const handleBackPress = () => {
        navigation.navigate('Home');
    };

    const handleRemoveParticipant = async (participant: PartyParticipant) => {
        try {
            await updatePartyParticipant(participant.perfil.id, { 'perfil.status': 'removido' } as any);
        } catch (error) {
            console.error("Erro ao remover participante:", error);
            setErrorModalMessage("Falha ao remover participante.");
            setErrorModalVisible(true);
        }
    };

    const handleAddDependent = () => {
        setAddDependentVisible(true);
    };

    const handleDependentAdded = () => {
        // Agora atualizado via onSnapshot
    };

    const handleNavigateToCreateDependent = () => {
        navigation.navigate('FormDependente');
    };

    const confirmadosCount = participantes.filter(p => p.perfil.status === 'confirmado').length;
    const participantesTotal = participantes.length;

    return {
        partyId,
        party,
        usuarioAtual,
        participantes: [...participantes].sort((a, b) => {
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
        participantesTotal,
        handleBackPress,
        isAddDependentVisible,
        setAddDependentVisible,
        handleRemoveParticipant,
        handleAddDependent,
        handleDependentAdded,
        isCurrentUserPendente,
        isConfirmModalVisible,
        setConfirmModalVisible,
        isConfirming,
        handleConfirmPresence,
        handleNavigateToCreateDependent,
        errorModalVisible,
        errorModalMessage,
        setErrorModalVisible,
    };
}
