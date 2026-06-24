import { PartyParticipant } from '../types/PartyParticipant';
import { usuariosMock } from '../mocks/usuariosMock';
import { perfisMock } from '../mocks/perfisMock';

export const participantesMock: PartyParticipant[] = usuariosMock
    .map((usuario) => {
        const perfil = perfisMock.find((p) => p.user_id === usuario.id);
        return perfil ? { usuario, perfil } : null;
    })
    .filter((p): p is PartyParticipant => p !== null);