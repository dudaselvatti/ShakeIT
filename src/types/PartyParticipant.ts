import { Usuario } from './Usuario';
import { Perfil } from './Perfil';

export interface PartyParticipant {
    usuario: Usuario;
    perfil: Perfil;
    has_revealed_draw?: boolean;
}