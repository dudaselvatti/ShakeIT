import { Participante } from '../../types/Participante';

export interface Props {
    participante: Participante;
}

export function useParticipanteCardViewModel({ participante }: Props) {
    const nome = participante.usuario.nome;

    const isConfirmado = participante.perfil.status === 'confirmado';

    const statusIcon = isConfirmado ? require('../../../assets/cadeado-fechado.png') : require('../../../assets/cadeado-aberto.png');

    const statusText = isConfirmado ? "" : participante.perfil.status;

    return {
        nome,
        statusIcon,
        statusText,
        isConfirmado,
    };
};