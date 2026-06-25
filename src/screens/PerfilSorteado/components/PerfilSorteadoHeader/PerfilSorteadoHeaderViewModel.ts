import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { useMemo } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../../../App';
import { calcularIdade } from '../../../../utils/Usuario/calcularIdade';

export interface Props {
    fotoUrl: string;
    nome: string;
    dataDeNascimento: string;
    genero: string;
    participantType?: string;
    dependentType?: string;
}

export function usePerfilSorteadoHeaderViewModel ({fotoUrl, nome, dataDeNascimento, genero, participantType, dependentType }: Props) {

    const idade = useMemo(() => {
        try {
            return calcularIdade(dataDeNascimento);
        } catch (error) {
            console.error("Erro ao calcular idade:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
            return 0;
        }
    }, [dataDeNascimento]);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleReturnHome = () => {
        navigation.navigate("Home");
    };

    return {
        fotoUrl,
        nome,
        idade,
        genero,
        participantType,
        dependentType,
        handleReturnHome,
    };
};