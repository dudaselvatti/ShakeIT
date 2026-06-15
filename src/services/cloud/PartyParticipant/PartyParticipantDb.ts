import { participantesMock } from "../../../mocks/participantesMock";

export async function getAmigoSecreto(idUsuario: string): Promise<any> {
    const participante = participantesMock.find(p => p.usuario.id === idUsuario);
    if (!participante) {
        throw new Error("Participante não foi encontrado!");
    }
    return participante;
}