import { renderHook, act } from "@testing-library/react-native";
import { useSettingsViewModel } from './SettingsViewModel'; 
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { resetUserPassword } from '../../services/cloud/User/UserDb';

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../services/cloud/User/UserDb', () => ({
  resetUserPassword: jest.fn(),
}));

describe('useSettingsViewModel', () => {
  const mockReset = jest.fn();
  const mockNavigation = { reset: mockReset };
  const mockLogoutContext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      usuarioAtual: { email: 'teste@email.com' },
      logoutContext: mockLogoutContext,
    });
  });
  
  it('deve inicializar com os estados corretos', () => {
    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    expect(result.current.modalConfig.visible).toBe(false);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.errors).toEqual({ passwordReset: '', emailReset: '', logout: '' });
    expect(result.current.success).toEqual({ passwordReset: '', emailReset: '', logout: '' });
  });

  it('deve abrir o modal de logout ao chamar handleLogout', () => {
    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    act(() => {
      result.current.handleLogout();
    });

    expect(result.current.modalConfig.visible).toBe(true);
    expect(result.current.modalConfig.type).toBe('logout');
  });

  it('deve fechar o modal ao chamar cancelModal', () => {
    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    act(() => { result.current.handleLogout(); });
    act(() => { result.current.cancelModal(); });

    expect(result.current.modalConfig.visible).toBe(false);
  });
  
  it('deve alterar a senha com sucesso quando houver usuário logado', async () => {
    (resetUserPassword as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    await act(async () => {
      await result.current.handleAlterarSenha();
    });

    expect(resetUserPassword).toHaveBeenCalledWith({ email: 'teste@email.com' });
    expect(result.current.success.passwordReset).toBe('O link de redefinição de senha foi enviado para o seu e-mail.');
    expect(result.current.errors.passwordReset).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('deve retornar erro ao tentar alterar senha se não houver usuário logado', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      usuarioAtual: null,
      logoutContext: mockLogoutContext,
    });

    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    await act(async () => {
      await result.current.handleAlterarSenha();
    });

    expect(resetUserPassword).not.toHaveBeenCalled();
    expect(result.current.errors.passwordReset).toBe('Falha ao obter o usuário logado.');
    expect(result.current.isLoading).toBe(true);
  });

  it('deve tratar erro caso a API de resetUserPassword falhe', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (resetUserPassword as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    await act(async () => {
      await result.current.handleAlterarSenha();
    });

    expect(result.current.errors.passwordReset).toBe('Erro ao enviar o link de redefinição.');
    expect(result.current.isLoading).toBe(false);
    
    consoleErrorSpy.mockRestore();
  });
  
  it('deve realizar o logout com sucesso e redirecionar o usuário', async () => {
    mockLogoutContext.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    await act(async () => {
      result.current.handleLogout(); // define o tipo do modal para 'logout'
    });
    await act(async () => {
      await result.current.confirmModal();
    });

    expect(result.current.modalConfig.visible).toBe(false);
    expect(mockLogoutContext).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('deve tratar erro caso o logoutContext falhe', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockLogoutContext.mockRejectedValueOnce(new Error('Logout failed'));

    const { result } = renderHook(() => useSettingsViewModel(mockNavigation));

    await act(async () => {
      result.current.handleLogout(); // define o tipo do modal para 'logout'
    });
    await act(async () => {
      await result.current.confirmModal();
    });

    expect(result.current.errors.logout).toBe('Erro ao sair da conta. Tente novamente.');
    expect(mockReset).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});