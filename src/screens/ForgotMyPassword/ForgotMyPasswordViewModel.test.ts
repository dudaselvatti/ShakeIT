import { renderHook, act } from '@testing-library/react-native';
import { useForgotMyPasswordViewModel } from './ForgotMyPasswordViewModel';
import { isValidEmail } from '../../utils/Formatting/isValidEmail';
import { resetUserPassword } from '../../services/cloud/User/UserDb';

jest.mock('../../utils/Formatting/isValidEmail', () => ({
  isValidEmail: jest.fn(),
}));

jest.mock('../../services/cloud/User/UserDb', () => ({
  resetUserPassword: jest.fn(),
}));

describe('useForgotMyPasswordViewModel', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar com os estados padrão corretos', () => {
    const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

    expect(result.current.email).toBe('');
    expect(result.current.errors).toEqual({ email: '' });
    expect(result.current.success).toBe('');
    expect(result.current.isLoading).toBe(true); 
  });

  it('deve atualizar o estado do e-mail corretamente', () => {
    const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

    act(() => {
      result.current.updateEmail('usuario@teste.com');
    });

    expect(result.current.email).toBe('usuario@teste.com');
  });

  it('deve limpar o erro do e-mail quando o usuário voltar a digitar', async () => {
    const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

    await act(async () => {
      await result.current.handleVerificarEmail();
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

  describe('Fluxo de handleVerificarEmail e Integração com API', () => {
    it('deve setar erro apropriado se o e-mail estiver em branco/vazio', async () => {
      const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

      await act(async () => {
        await result.current.handleVerificarEmail();
      });

      expect(result.current.errors.email).toBe('Insira seu email.');
      expect(resetUserPassword).not.toHaveBeenCalled();
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
      expect(resetUserPassword).not.toHaveBeenCalled();
    });

    it('deve enviar o e-mail com sucesso e atualizar os estados', async () => {
      (isValidEmail as jest.Mock).mockReturnValue(true);
      (resetUserPassword as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

      act(() => {
        result.current.updateEmail('sucesso@teste.com');
      });

      await act(async () => {
        await result.current.handleVerificarEmail();
      });

      expect(isValidEmail).toHaveBeenCalledWith('sucesso@teste.com');
      expect(resetUserPassword).toHaveBeenCalledWith({ email: 'sucesso@teste.com' });
      expect(result.current.errors.email).toBe('');
      expect(result.current.success).toBe('O link de redefinição de senha foi enviado para o seu e-mail.');
      expect(result.current.isLoading).toBe(false);
    });

    it('deve tratar erro de usuário não encontrado (auth/user-not-found)', async () => {
      (isValidEmail as jest.Mock).mockReturnValue(true);
      (resetUserPassword as jest.Mock).mockRejectedValue({ code: 'auth/user-not-found' });

      const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

      act(() => {
        result.current.updateEmail('nao_existe@teste.com');
      });

      await act(async () => {
        await result.current.handleVerificarEmail();
      });

      expect(result.current.errors.email).toBe('Este e-mail não está cadastrado.');
      expect(result.current.success).toBe('');
      expect(result.current.isLoading).toBe(false);
    });

    it('deve tratar erro de e-mail inválido retornado pela API (auth/invalid-email)', async () => {
      (isValidEmail as jest.Mock).mockReturnValue(true);
      (resetUserPassword as jest.Mock).mockRejectedValue({ code: 'auth/invalid-email' });

      const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

      act(() => {
        result.current.updateEmail('api-rejeitou@teste.com');
      });

      await act(async () => {
        await result.current.handleVerificarEmail();
      });

      expect(result.current.errors.email).toBe('O formato do e-mail é inválido.');
      expect(result.current.success).toBe('');
    });

    it('deve tratar erros genéricos da API', async () => {
      (isValidEmail as jest.Mock).mockReturnValue(true);
      jest.spyOn(console, 'error').mockImplementation(() => {});
      (resetUserPassword as jest.Mock).mockRejectedValue(new Error('Erro interno'));

      const { result } = renderHook(() => useForgotMyPasswordViewModel(mockNavigation));

      act(() => {
        result.current.updateEmail('generico@teste.com');
      });

      await act(async () => {
        await result.current.handleVerificarEmail();
      });

      expect(result.current.errors.email).toBe('Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.');
      expect(result.current.success).toBe('');
    });
  });
});