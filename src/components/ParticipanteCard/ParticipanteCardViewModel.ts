import { PartyParticipant } from '../../types/PartyParticipant';

export interface Props {
    participante: PartyParticipant;
    onRemove?: (participante: PartyParticipant) => void;
    showRemoveIcon?: boolean;
    isAdmin?: boolean;
    isCurrentUser?: boolean;
}

export function useParticipanteCardViewModel({ participante, onRemove, showRemoveIcon, isAdmin, isCurrentUser }: Props) {
    let nome = participante.perfil.participant_name || participante.usuario.nome;
    if (isCurrentUser) {
        nome += " (Você)";
    } else if (isAdmin) {
        nome += " (Admin)";
    }

    const isConfirmado = participante.perfil.status === 'confirmado';

    const statusIcon = isConfirmado ? require('../../../assets/cadeado-fechado.png') : require('../../../assets/cadeado-aberto.png');

    const statusText = isConfirmado ? "" : participante.perfil.status;

    const rawAvatarUrl = participante.perfil.participant_type === 'dependent' ? participante.perfil.participant_avatar : (participante.perfil.participant_avatar || participante.usuario.avatar_url);
    const avatarUrl = rawAvatarUrl === "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" ? null : rawAvatarUrl;

    let avatarSource = require('../../../assets/perfil-padrao.png');
    if (avatarUrl) {
        avatarSource = { uri: avatarUrl };
    } else if (participante.perfil.participant_type === 'dependent') {
        if (participante.perfil.dependent_type === 'child') {
            avatarSource = require('../../../assets/crianca.png');
        } else if (participante.perfil.dependent_type === 'pet') {
            avatarSource = require('../../../assets/pet.png');
        }
    }

    return {
        nome,
        statusIcon,
        statusText,
        isConfirmado,
        avatarSource,
        onRemove: onRemove ? () => onRemove(participante) : undefined,
        showRemoveIcon,
    };
};