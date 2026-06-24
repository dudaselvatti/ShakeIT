import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { PartyParticipant } from '../../types/PartyParticipant';
import { getParticipantsByPartyId, updatePartyParticipant, confirmPresenceInParty } from '../../services/cloud/PartyParticipant/PartyParticipantDb';
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

    useEffect(() => {
        async function fetchParticipants() {
            try {
                const partyParticipants = await getParticipantsByPartyId(partyId);
                setParticipantes(partyParticipants);
            } catch (error) {
                console.error("Erro ao buscar participantes no Firestore:", error);
            }
        }
        if (partyId) {
            fetchParticipants();
        }
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
            const partyParticipants = await getParticipantsByPartyId(partyId);
            setParticipantes(partyParticipants);
        } catch (error) {
            console.error("Erro ao confirmar presença:", error);
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
            setParticipantes(prev => prev.filter(p => p.perfil.id !== participant.perfil.id));
        } catch (error) {
            console.error("Erro ao remover participante:", error);
        }
    };

    const handleAddDependent = () => {
        setAddDependentVisible(true);
    };

    const handleDependentAdded = () => {
        getParticipantsByPartyId(partyId).then(setParticipantes);
    };

    const handleNavigateToCreateDependent = () => {
        navigation.navigate('FormDependente');
    };

    const confirmadosCount = participantes.filter(p => p.perfil.status === 'confirmado').length;
    const participantesTotal = participantes.length;

    return {
        partyId,
        usuarioAtual,
        participantes,
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
    };
}
