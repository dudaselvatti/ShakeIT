import { useRoute, RouteProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getAmigoSecreto } from '../../services/cloud/Participant/PartcicipantDb';
import { storageService } from '../../services/storageService';
import { Participante } from '../../types/Participante';

type RootStackParamList = {
    PerfilSorteado: { idUsuario: string };
};

type PerfilScreenRouteProp = RouteProp<RootStackParamList, 'PerfilSorteado'>;

export function usePerfilSorteadoViewModel() {
    const route = useRoute<PerfilScreenRouteProp>();
    const { idUsuario } = route.params;

    const [participante, setParticipante] = useState<Participante | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAmigo = async () => {
            try {
                const data = await getAmigoSecreto(idUsuario);
                setParticipante(data);
                await storageService.setItem(`amigo_secreto_${idUsuario}`, data);
            } catch (error) {
                const cachedData = await storageService.getItem<Participante>(`amigo_secreto_${idUsuario}`);
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
    }, [idUsuario]);

    return {
        participante,
        isLoading,
    };
}