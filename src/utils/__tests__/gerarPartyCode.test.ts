import { gerarPartyCode } from '../PartyCode';

describe('generatePartyCode', () => {
    it('deve gerar um código com prefixo # e exatamente 7 caracteres', () => {
        const code = gerarPartyCode();

        expect(code).toHaveLength(7);
        expect(code.startsWith('#')).toBe(true);
    });

    it('deve conter apenas caracteres válidos após o #', () => {
        const code = gerarPartyCode();
        const regex = /^#[A-Z0-9]{6}$/;

        expect(regex.test(code)).toBe(true);
    });

    it('deve gerar códigos diferentes em múltiplas execuções', () => {
        const iteracoes = 10;
        const codes = new Set();

        for (let i = 0; i < iteracoes; i++) {
            codes.add(gerarPartyCode());
        }

        expect(codes.size).toBe(iteracoes);
    });
});