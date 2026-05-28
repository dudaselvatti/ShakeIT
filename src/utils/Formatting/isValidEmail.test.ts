import { isValidEmail } from './isValidEmail';

describe('isValidEmail', () => {
  
  describe('E-mails válidos', () => {
    it('deve retornar true para um e-mail padrão válido', () => {
      expect(isValidEmail('usuario@dominio.com')).toBe(true);
    });

    it('deve retornar true para e-mails com subdomínios', () => {
      expect(isValidEmail('nome.sobrenome@sub.dominio.com.br')).toBe(true);
    });

    it('deve retornar true para e-mails contendo números e caracteres especiais permitidos', () => {
      expect(isValidEmail('user123_456@provedor.net')).toBe(true);
    });
  });

  describe('E-mails inválidos', () => {
    it('deve retornar false se não houver o caractere @', () => {
      expect(isValidEmail('usuariodominio.com')).toBe(false);
    });

    it('deve retornar false se não houver o ponto no domínio', () => {
      expect(isValidEmail('usuario@dominio')).toBe(false);
    });

    it('deve retornar false se não houver nada antes do @', () => {
      expect(isValidEmail('@dominio.com')).toBe(false);
    });

    it('deve retornar false se não houver nada entre o @ e o ponto', () => {
      expect(isValidEmail('usuario@.com')).toBe(false);
    });

    it('deve retornar false se não houver nada após o ponto', () => {
      expect(isValidEmail('usuario@dominio.')).toBe(false);
    });

    it('deve retornar false se contiver espaços em branco', () => {
      expect(isValidEmail('usuario @dominio.com')).toBe(false);
      expect(isValidEmail('usuario@dominio .com')).toBe(false);
    });

    it('deve retornar false para strings vazias', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

});