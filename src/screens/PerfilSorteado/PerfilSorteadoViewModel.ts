import { useRoute, RouteProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getPartyParticipantByPerfilId } from '../../services/cloud/PartyParticipant/PartyParticipantDb';
import { storageService } from '../../services/storageService';
import { PartyParticipant } from '../../types/PartyParticipant';

type RootStackParamList = {
    PerfilSorteado: { idPerfil: string };
};

type PerfilScreenRouteProp = RouteProp<RootStackParamList, 'PerfilSorteado'>;

export function usePerfilSorteadoViewModel() {
    const route = useRoute<PerfilScreenRouteProp>();
    const { idPerfil } = route.params;

    const [participante, setParticipante] = useState<PartyParticipant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAmigo = async () => {
            try {
                const data = await getPartyParticipantByPerfilId(idPerfil);
                setParticipante(data);
                await storageService.setItem(`amigo_secreto_${idPerfil}`, data);
            } catch (error) {
                const cachedData = await storageService.getItem<PartyParticipant>(`amigo_secreto_${idPerfil}`);
                if (cachedData) {
                    setParticipante(cachedData);
                } else {
                    console.error(error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAmigo();
    }, [idPerfil]);

    return {
        participante,
        isLoading,
    };
}