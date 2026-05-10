import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('deve formatar valores básicos corretamente', () => {
    expect(formatCurrency('100')).toBe('1,00');
    expect(formatCurrency('1250')).toBe('12,50');
  });

  it('deve aplicar separadores de milhar corretamente', () => {
    expect(formatCurrency('100000')).toBe('1.000,00');
    expect(formatCurrency('123456789')).toBe('1.234.567,89');
  });

  it('deve remover caracteres não numéricos antes de formatar', () => {
    expect(formatCurrency('R$ 10,50')).toBe('10,50');
    expect(formatCurrency('1a2b3c')).toBe('1,23');
    expect(formatCurrency('1.000,00')).toBe('1.000,00');
  });

  it('deve retornar uma string vazia se o valor for vazio ou sem números', () => {
    expect(formatCurrency('')).toBe('');
    expect(formatCurrency('abc')).toBe('');
    expect(formatCurrency('   ')).toBe('');
  });

  it('deve lidar com valores pequenos (menores que 100)', () => {
    expect(formatCurrency('5')).toBe('0,05');
    expect(formatCurrency('50')).toBe('0,50');
  });

  it('deve lidar com strings contendo apenas zeros', () => {
    expect(formatCurrency('000')).toBe('0,00');
    expect(formatCurrency('0')).toBe('0,00');
  });
});