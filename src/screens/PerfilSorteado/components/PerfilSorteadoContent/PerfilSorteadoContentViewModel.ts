import { Medidas, Preferencias } from '../../../../types/Perfil';

export interface Props {
    medidas: Medidas;
    preferencias: Preferencias;
}

export function usePerfilSorteadoContentViewModel({ medidas, preferencias }: Props) {
    return {
        medidas: medidas,
        preferencias: preferencias,
    };
}