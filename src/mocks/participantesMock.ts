import { Participante } from '../types/Participante';
import { usuariosMock } from '../mocks/usuariosMock';
import { perfisMock } from '../mocks/perfisMock';

export const participantesMock: Participante[] = usuariosMock
    .map((usuario) => {
        const perfil = perfisMock.find((p) => p.user_id === usuario.id);
        return perfil ? { usuario, perfil } : null;
    })
    .filter((p): p is Participante => p !== null);