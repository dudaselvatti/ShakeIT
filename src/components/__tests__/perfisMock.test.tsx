import { usuariosMock } from "../../mocks/usuariosMock";
import { perfisMock } from "../../mocks/perfisMock";

describe("Ligação Perfil ↔ Usuario (Relacionamento)", () => {
    it("deve recuperar corretamente nome e fotoUrl do Usuario a partir do idUsuario do Perfil", () => {
        const perfil = perfisMock.find(p => p.idUsuario === 2);

        expect(perfil).toBeDefined();

        const usuario = usuariosMock.find(u => u.id === perfil!.idUsuario);

        expect(usuario).toBeDefined();

        expect(usuario!.nome).toBe("Maria da Silva");
        expect(usuario!.fotoUrl).toBe("https://i.pravatar.cc/150?img=2");
    });
});