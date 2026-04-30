import { Usuario } from './Usuario';
import { Perfil } from './Perfil';

export interface Participante {
    usuario: Usuario;
    perfil: Perfil;
}