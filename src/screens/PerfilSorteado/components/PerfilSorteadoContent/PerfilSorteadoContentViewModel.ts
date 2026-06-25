import { Medidas, Preferencias } from '../../../../types/Perfil';

export interface Props {
    bio?: string;
    medidas: Medidas;
    preferencias: Preferencias;
}

export function usePerfilSorteadoContentViewModel({ bio, medidas, preferencias }: Props) {
    return {
        bio,
        medidas: medidas,
        preferencias: preferencias,
    };
}