
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { PartyParticipant } from '../../types/PartyParticipant';
import { getParticipantsByPartyId, updatePartyParticipant, confirmPresenceInParty, listenToParticipantsByPartyId } from '../../services/cloud/PartyParticipant/PartyParticipantDb';
import { getPartyFromCloud, listenToParty } from '../../services/cloud/Party/PartyDb';
import { createNotification } from '../../services/cloud/Notification/NotificationDb';
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
    const [isLeaveModalVisible, setLeaveModalVisible] = useState(false);
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

    // Auto-navigate if party status changes to drawn or revealed
    useEffect(() => {
        if (party && participantes.length > 0) {
            if (party.status === 'sorteio_realizado' || party.status === 'sorteio_revelado') {
                const userParticipant = participantes.find(p => p.perfil.user_id === usuarioAtual?.id && p.perfil.participant_type === 'user');
                
                if (party.status === 'sorteio_revelado') {
                    navigation.replace("PerfilSorteado", { partyId: party.id });
                } else if (!userParticipant?.perfil.has_revealed_draw && !userParticipant?.has_revealed_draw) {
                    navigation.replace("ShakeReveal", { partyId: party.id });
                } else {
                    navigation.replace("PerfilSorteado", { partyId: party.id });
                }
            }
        }
    }, [party?.status, participantes.length]);

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
            
            if (party && party.admin_id !== usuarioAtual.id) {
                createNotification({
                    user_id: party.admin_id,
                    title: "Presença confirmada!",
                    message: `${usuarioAtual.nome} confirmou presença no evento ${party.name}`,
                    type: 'system',
                    related_party_id: party.id
                }).catch(console.error);
            }
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

    const handleLeaveEvent = async () => {
        if (!usuarioAtual) return;
        setIsConfirming(true);
        try {
            const myParticipants = participantes.filter(p => p.perfil.user_id === usuarioAtual.id);
            for (const p of myParticipants) {
                await updatePartyParticipant(p.perfil.id, { 'perfil.status': 'removido' } as any);
            }
            setLeaveModalVisible(false);
            navigation.navigate('Home');
        } catch (error) {
            console.error("Erro ao sair do evento:", error);
            setErrorModalMessage("Falha ao sair do evento.");
            setErrorModalVisible(true);
        } finally {
            setIsConfirming(false);
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

    const handleNavigateToResults = () => {
        if (!party) return;
        const userParticipant = participantes.find(p => p.perfil.user_id === usuarioAtual?.id && p.perfil.participant_type === 'user');
        
        if (party.status === 'sorteio_realizado' && !userParticipant?.perfil.has_revealed_draw && !userParticipant?.has_revealed_draw) {
            navigation.navigate("ShakeReveal", { partyId: party.id });
        } else {
            navigation.navigate("PerfilSorteado", { partyId: party.id });
        }
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
        isLeaveModalVisible,
        setLeaveModalVisible,
        handleLeaveEvent,
        handleNavigateToCreateDependent,
        handleNavigateToResults,
        errorModalVisible,
        errorModalMessage,
        setErrorModalVisible,
    };
}
