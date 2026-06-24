import { getAmigoSecreto } from "./PartyParticipantDb";
import { participantesMock } from "../../../mocks/participantesMock";

describe("ParticipantDb - Testes Unitários", () => {
    
    it("deve retornar o participante correto quando um idPerfil válido for fornecido", async () => {
        const participanteEsperado = participantesMock[0];
        const idPerfilValido = participanteEsperado.perfil.id;

        const resultado = await getAmigoSecreto(idPerfilValido);

        expect(resultado).toEqual(participanteEsperado);
        expect(resultado.perfil.id).toBe(idPerfilValido);
    });

    it("deve lançar um erro quando o idPerfil não for encontrado no mock", async () => {
        const idPerfilInexistente = "00000000-0000-0000-0000-000000000000";

        await expect(getAmigoSecreto(idPerfilInexistente)).rejects.toThrow(
            "Participante não foi encontrado!"
        );
    });

    it("deve buscar o perfil e usuário corretos para um caso específico (ex: Maria da Silva)", async () => {
        const idMaria = "550e8400-e29b-41d4-a716-446655440002";

        const resultado = await getAmigoSecreto(idMaria);

        expect(resultado.usuario.nome).toBe("Maria da Silva");
        expect(resultado.perfil.participant_name).toBe("Maria da Silva");
        expect(resultado.perfil.preferencias.coisasQueAmo).toContain("Maquiagem");
    });
});