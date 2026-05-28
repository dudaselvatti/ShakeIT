import { renderHook, act } from '@testing-library/react-native';
import { useForgotMyPasswordViewModel } from './ForgotMyPasswordViewModel';
import { isValidEmail } from '../../utils/Formatting/isValidEmail';

jest.mock('../../utils/Formatting/isValidEmail', () => ({
  isValidEmail: jest.fn(),
}));

describe('useForgotMyPasswordViewModel', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar com os estados padrão vazios', () => {
    const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

    expect(result.current.email).toBe('');
    expect(result.current.errors).toEqual({ email: '' });
  });

  it('deve atualizar o estado do e-mail corretamente', () => {
    const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

    act(() => {
      result.current.updateEmail('usuario@teste.com');
    });

    expect(result.current.email).toBe('usuario@teste.com');
  });

  it('deve limpar o erro do e-mail quando o usuário voltar a digitar', () => {
    const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

    act(() => {
      result.current.handleVerificarEmail();
    });
    expect(result.current.errors.email).toBe('Insira seu email.');

    act(() => {
      result.current.updateEmail('a');
    });

    expect(result.current.errors.email).toBe('');
  });

  it('deve chamar navigation.goBack() ao executar handleBackPress', () => {
    const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

    act(() => {
      result.current.handleBackPress();
    });

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  describe('Validação de E-mail (handleVerificarEmail)', () => {
    it('deve setar erro apropriado se o e-mail estiver em branco/vazio', async () => {
      const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

      await act(async () => {
        await result.current.handleVerificarEmail();
      });

      expect(result.current.errors.email).toBe('Insira seu email.');
    });

    it('deve setar erro apropriado se o formato do e-mail for inválido', async () => {
      (isValidEmail as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

      act(() => {
        result.current.updateEmail('email-invalido.com');
      });

      await act(async () => {
        await result.current.handleVerificarEmail();
      });

      expect(isValidEmail).toHaveBeenCalledWith('email-invalido.com');
      expect(result.current.errors.email).toBe('Email inválido.');
    });

    it('deve passar na validação sem erros se o e-mail for válido', async () => {
      (isValidEmail as jest.Mock).mockReturnValue(true);

      const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

      act(() => {
        result.current.updateEmail('sucesso@teste.com');
      });

      await act(async () => {
        await result.current.handleVerificarEmail();
      });

      expect(isValidEmail).toHaveBeenCalledWith('sucesso@teste.com');
      expect(result.current.errors.email).toBe('');
    });
  });
});