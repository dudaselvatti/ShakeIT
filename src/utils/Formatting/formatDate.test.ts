import { formatDate } from './formatDate';

describe('formatDate', () => {
  const mockDate = new Date(2026, 4, 10);

  it('deve formatar a data corretamente no padrão pt-BR por padrão', () => {
    const result = formatDate(mockDate);
    
    expect(result).toBe('10/05/2026');
  });

  it('deve formatar a data de acordo com um locale específico (en-US)', () => {
    const result = formatDate(mockDate, 'en-US');
    
    expect(result).toBe('5/10/2026');
  });

  it('deve retornar uma string vazia quando o valor for undefined', () => {
    const result = formatDate(undefined);
    
    expect(result).toBe('');
  });

  it('deve retornar uma string vazia quando o valor for null', () => {
    const result = formatDate(null);
    
    expect(result).toBe('');
  });

  it('deve lidar com datas em formatos diferentes (ex: ISO string convertida)', () => {
    const isoDate = new Date('2026-12-25T10:00:00Z');
    const result = formatDate(isoDate);
    
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});