import { useMemo } from 'react';
import { calcularIdade } from '../../utils/Usuario/calcularIdade';

interface Props {
    fotoUrl: string;
    nome: string;
    dataDeNascimento: string;
    genero: string;
}

export const usePerfilSorteadoHeaderViewModel = ({
    fotoUrl,
    nome,
    dataDeNascimento,
    genero,
}: Props) => {

    const idade = useMemo(() => {
        return calcularIdade(dataDeNascimento);
    }, [dataDeNascimento]);

    return {
        fotoUrl,
        nome,
        idade,
        genero,
    };
};