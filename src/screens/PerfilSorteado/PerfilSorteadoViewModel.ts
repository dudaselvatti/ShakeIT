import Toast from 'react-native-toast-message';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { getParticipantsByPartyId } from '../../services/cloud/PartyParticipant/PartyParticipantDb';
import { getPartyFromCloud, updateParty } from '../../services/cloud/Party/PartyDb';
import { getDrawResultByGiverProfileId, getAllDrawResultsByPartyId } from '../../services/cloud/DrawResult/DrawResultDb';
import { createNotification } from '../../services/cloud/Notification/NotificationDb';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { PartyParticipant } from '../../types/PartyParticipant';
import { Party } from '../../types/Party';
import { DrawResult } from '../../types/DrawResult';

type RootStackParamList = {
    PerfilSorteado: { partyId: string };
};

type PerfilScreenRouteProp = RouteProp<RootStackParamList, 'PerfilSorteado'>;

export interface TabData {
    key: string;
    label: string;
    type: 'receiver' | 'event';
    participant?: PartyParticipant; // the receiver profile
    party?: Party;
    allParticipants?: PartyParticipant[];
    allDrawResults?: DrawResult[];
}

export function usePerfilSorteadoViewModel() {
    const route = useRoute<PerfilScreenRouteProp>();
    const { partyId } = route.params;
    const { usuarioAtual } = useAuth();

    const [tabs, setTabs] = useState<TabData[]>([]);
    const [activeTabKey, setActiveTabKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const loadAllData = useCallback(async () => {
        if (!usuarioAtual) return;
        try {
            const party = await getPartyFromCloud(partyId);
            const allParticipants = await getParticipantsByPartyId(partyId);
            
            const myProfiles = allParticipants.filter(p => p.perfil.user_id === usuarioAtual.id);
            
            const receiverTabs: TabData[] = [];
            
            for (const profile of myProfiles) {
                const drawResult = await getDrawResultByGiverProfileId(partyId, profile.perfil.id);
                if (drawResult) {
                    const receiver = allParticipants.find(p => p.perfil.id === drawResult.receiver_profile_id);
                    if (receiver) {
                        let label = "Eu";
                        if (profile.perfil.participant_type === "dependent") {
                            label = profile.perfil.participant_name.split(' ')[0];
                        }
                        receiverTabs.push({
                            key: `receiver_${profile.perfil.id}`,
                            label: label,
                            type: 'receiver',
                            participant: receiver,
                        });
                    }
                }
            }
            
            let drawResults: DrawResult[] = [];
            if (party?.status === 'sorteio_revelado') {
                drawResults = await getAllDrawResultsByPartyId(partyId);
            }

            receiverTabs.sort((a, b) => {
                if (a.label === "Eu") return -1;
                if (b.label === "Eu") return 1;
                return a.label.localeCompare(b.label);
            });

            const newTabs: TabData[] = [...receiverTabs];

            newTabs.push({
                key: 'evento',
                label: 'Evento',
                type: 'event',
                party: party || undefined,
                allParticipants: allParticipants.filter(p => p.perfil.status === 'confirmado'),
                allDrawResults: drawResults
            });
            
            setTabs(newTabs);
            if (newTabs.length > 0 && !activeTabKey) {
                setActiveTabKey(newTabs[0].key);
            }
            
        } catch (error) {
            console.error(error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
        } finally {
            setIsLoading(false);
        }
    }, [partyId, usuarioAtual, activeTabKey]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    const handleRevealAll = () => {
        const eventTab = tabs.find(t => t.type === 'event');
        const party = eventTab?.party;
        if (!party) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(party.event_date + "T00:00:00");
        
        if (eventDate.getTime() >= today.getTime()) {
            return false;
        }

        return true;
    };

    const confirmRevealAll = async () => {
        setIsLoading(true);
        try {
            await updateParty(partyId, { status: 'sorteio_revelado' });
            
            const eventTab = tabs.find(t => t.type === 'event');
            if (eventTab?.allParticipants && eventTab?.party) {
                const uniqueUserIds = [...new Set(eventTab.allParticipants.map(p => p.perfil.user_id))];
                const notificationPromises = uniqueUserIds.map(userId => 
                    createNotification({
                        user_id: userId,
                        title: "Gabarito Revelado!",
                        message: `O organizador acabou de revelar o gabarito do evento ${eventTab.party!.name}. Corre pra ver quem tirou quem!`,
                        type: 'general',
                        related_party_id: partyId
                    })
                );
                Promise.all(notificationPromises).catch(() => {});
            }

            await loadAllData();
        } catch (error) {
            console.error("Erro ao revelar sorteio", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        usuarioAtual,
        tabs,
        activeTabKey,
        setActiveTabKey,
        isLoading,
        handleRevealAll,
        confirmRevealAll
    };
}