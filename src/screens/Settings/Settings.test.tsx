import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsScreen } from './index';
import { useSettingsViewModel } from './SettingsViewModel';

jest.mock('./SettingsViewModel', () => ({
  useSettingsViewModel: jest.fn(),
}));

describe('SettingsScreen', () => {
  const mockNavigation = { navigate: jest.fn() };
  
  const mockHandleAlterarSenha = jest.fn();
  const mockHandleLogout = jest.fn();
  const mockCancelLogout = jest.fn();
  const mockConfirmLogout = jest.fn();

  const setupHookMock = (overrides = {}) => {
    (useSettingsViewModel as jest.Mock).mockReturnValue({
      isModalVisible: false,
      errors: { passwordReset: '', logout: '' },
      success: { passwordReset: '', logout: '' },
      handleAlterarSenha: mockHandleAlterarSenha,
      handleLogout: mockHandleLogout,
      cancelLogout: mockCancelLogout,
      confirmLogout: mockConfirmLogout,
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('deve renderizar a tela com os elementos estruturais principais', () => {
    setupHookMock();

    const { getByText, queryByText } = render(
      <SettingsScreen navigation={mockNavigation} />
    );

    expect(getByText('Configurações')).toBeTruthy();
    expect(getByText('Conta')).toBeTruthy();
    expect(getByText('Alterar Senha')).toBeTruthy();
    expect(getByText('Sair da Conta')).toBeTruthy();

    expect(queryByText('Tem certeza que deseja sair da conta?')).toBeNull();
  });
  
  it('deve exibir a mensagem de erro ao falhar a redefinição de senha', () => {
    setupHookMock({
      errors: { passwordReset: 'Erro ao enviar o link de redefinição.', logout: '' },
    });

    const { getByText } = render(<SettingsScreen navigation={mockNavigation} />);

    expect(getByText('Erro ao enviar o link de redefinição.')).toBeTruthy();
  });

  it('deve exibir a mensagem de sucesso ao enviar redefinição de senha', () => {
    setupHookMock({
      success: { passwordReset: 'O link de redefinição foi enviado!', logout: '' },
    });

    const { getByText } = render(<SettingsScreen navigation={mockNavigation} />);

    expect(getByText('O link de redefinição foi enviado!')).toBeTruthy();
  });
  
  it('deve chamar handleAlterarSenha quando a opção Alterar Senha for pressionada', () => {
    setupHookMock();

    const { getByText } = render(<SettingsScreen navigation={mockNavigation} />);
    
    fireEvent.press(getByText('Alterar Senha'));

    expect(mockHandleAlterarSenha).toHaveBeenCalledTimes(1);
  });

  it('deve chamar handleLogout quando o botão Sair da Conta for pressionado', () => {
    setupHookMock();

    const { getByText } = render(<SettingsScreen navigation={mockNavigation} />);
    
    fireEvent.press(getByText('Sair da Conta'));

    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });
  
  it('deve repassar os callbacks de confirmar e cancelar para o PopupModal', () => {
    setupHookMock({
      isModalVisible: true,
    });

    const { getByText } = render(<SettingsScreen navigation={mockNavigation} />);

    expect(getByText('Tem certeza que deseja sair da conta?')).toBeTruthy();

    fireEvent.press(getByText('Cancelar'));
    expect(mockCancelLogout).toHaveBeenCalledTimes(1);

    fireEvent.press(getByText('Confirmar'));
    expect(mockConfirmLogout).toHaveBeenCalledTimes(1);
  });
});