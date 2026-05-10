import { useRoute, RouteProp } from '@react-navigation/native';
import { participantesMock } from '../../mocks/participantesMock';

type RootStackParamList = {
    PerfilSorteado: { idUsuario: number };
};

type PerfilScreenRouteProp = RouteProp<RootStackParamList, 'PerfilSorteado'>;

export function usePerfilSorteadoViewModel() {
    const route = useRoute<PerfilScreenRouteProp>();
    const { idUsuario } = route.params;

    const participante = participantesMock.find(
        p => p.usuario.id === Number(idUsuario)
    );

    if(!participante) {
        throw new Error("Participante não foi encontrado!")
    }

    return {
        participante,
        isLoading: false,
    };
};