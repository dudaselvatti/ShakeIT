import { PartyParticipant } from '../../types/PartyParticipant';

export interface Props {
    participante: PartyParticipant;
    onRemove?: (participante: PartyParticipant) => void;
    showRemoveIcon?: boolean;
}

export function useParticipanteCardViewModel({ participante, onRemove, showRemoveIcon }: Props) {
    const nome = participante.perfil.participant_name || participante.usuario.nome;

    const isConfirmado = participante.perfil.status === 'confirmado';

    const statusIcon = isConfirmado ? require('../../../assets/cadeado-fechado.png') : require('../../../assets/cadeado-aberto.png');

    const statusText = isConfirmado ? "" : participante.perfil.status;

    return {
        nome,
        statusIcon,
        statusText,
        isConfirmado,
        onRemove: onRemove ? () => onRemove(participante) : undefined,
        showRemoveIcon,
    };
};