import { Participante } from '../../types/Participante';

export interface Props {
    participante: Participante;
}

export function useParticipanteCardViewModel({ participante }: Props) {
    const nome = participante.usuario.nome;

    const isConfirmado = participante.perfil.status === 'confirmado';

    const statusIcon = isConfirmado ? "🔒" : "🔓";

    const statusText = isConfirmado ? "" : participante.perfil.status;

    return {
        nome,
        statusIcon,
        statusText,
        isConfirmado,
    };
};