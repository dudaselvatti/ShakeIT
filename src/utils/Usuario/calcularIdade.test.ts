import { calcularIdade } from './calcularIdade';

describe('Utils: calcularIdade', () => {
  
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-29T12:00:00'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Cenários de Sucesso', () => {
    it('deve calcular a idade corretamente se hoje for o dia do aniversário', () => {
      const idade = calcularIdade('1990-04-29');
      expect(idade).toBe(36);
    });

    it('deve calcular a idade corretamente se o aniversário ainda não passou no ano atual', () => {
      const idade = calcularIdade('1990-05-15');
      expect(idade).toBe(35);
    });

    it('deve calcular a idade corretamente se o aniversário já passou no ano atual', () => {
      const idade = calcularIdade('1990-01-01');
      expect(idade).toBe(36);
    });
  });

  describe('Cenários de Erro', () => {
    it('deve lançar erro para formato de data inválido', () => {
      expect(() => calcularIdade('29/04/1990')).toThrow("Formato de data inválido");
    });

    it('deve lançar erro para data futura', () => {
      expect(() => calcularIdade('2027-01-01')).toThrow("A data de nascimento não pode ser uma data futura");
    });

    it('deve lançar erro para data inexistente (ex: 30 de fevereiro)', () => {
      expect(() => calcularIdade('1990-02-30')).toThrow("A data fornecida é inválida");
    });
  });
});