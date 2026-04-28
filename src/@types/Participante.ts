import { Usuario } from '../@types/Usuario';
import { Perfil } from '../@types/Perfil';

export interface Participante {
    usuario: Usuario;
    perfil: Perfil;
}