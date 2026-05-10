import { Participante } from '../../types/Participante';

export interface Props {
    participante: Participante;
}

export function useParticipanteCardViewModel({ participante }: Props) {
    const nome = participante.usuario.nome;

    const isConfirmado = participante.perfil.isConfirmado;

    const statusIcon = isConfirmado ? "🔒" : "🔓";

    const statusText = isConfirmado ? "" : "Pendente";

    return {
        nome,
        statusIcon,
        statusText,
        isConfirmado,
    };
};