import { getAmigoSecreto } from "./PartcicipantDb";
import { participantesMock } from "../../../mocks/participantesMock";

describe("PartcicipantDb - Testes Unitários", () => {
    
    it("deve retornar o participante correto quando um idUsuario válido for fornecido", async () => {
        const participanteEsperado = participantesMock[0];
        const idUsuarioValido = participanteEsperado.usuario.id;

        const resultado = await getAmigoSecreto(idUsuarioValido);

        expect(resultado).toEqual(participanteEsperado);
        expect(resultado.usuario.id).toBe(idUsuarioValido);
    });

    it("deve lançar um erro quando o idUsuario não for encontrado no mock", async () => {
        const idUsuarioInexistente = "00000000-0000-0000-0000-000000000000";

        await expect(getAmigoSecreto(idUsuarioInexistente)).rejects.toThrow(
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