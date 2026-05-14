import { useMemo } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../../../App';
import { calcularIdade } from '../../../../utils/Usuario/calcularIdade';

export interface Props {
    fotoUrl: string;
    nome: string;
    dataDeNascimento: string;
    genero: string;
}

export function usePerfilSorteadoHeaderViewModel ({fotoUrl, nome, dataDeNascimento, genero }: Props) {

    const idade = useMemo(() => {
        return calcularIdade(dataDeNascimento);
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
        handleReturnHome,
    };
};