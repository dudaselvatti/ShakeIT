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
      modalConfig: { visible: false, title: '', message: '', type: 'info', hideCancel: false },
      isLoggedIn: true,
      errors: { passwordReset: '', emailReset: '', logout: '' },
      success: { passwordReset: '', emailReset: '', logout: '' },
      handleAlterarSenha: mockHandleAlterarSenha,
      handleAlterarEmail: jest.fn(),
      handleSuporte: jest.fn(),
      handleTermosUso: jest.fn(),
      handlePrivacidade: jest.fn(),
      handleExcluirConta: jest.fn(),
      handleLogout: mockHandleLogout,
      cancelModal: mockCancelLogout,
      confirmModal: mockConfirmLogout,
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
    expect(getByText('Aparência')).toBeTruthy();
    expect(getByText('Modo Escuro')).toBeTruthy();
    expect(getByText('Geral')).toBeTruthy();
    expect(getByText('Raspadinha (Sem acelerômetro)')).toBeTruthy();
    expect(getByText('Falar com o Suporte')).toBeTruthy();
    expect(getByText('Termos de Uso')).toBeTruthy();
    expect(getByText('Política de Privacidade')).toBeTruthy();
    expect(getByText('Conta')).toBeTruthy();
    expect(getByText('Alterar Senha')).toBeTruthy();
    expect(getByText('Alterar E-mail')).toBeTruthy();
    expect(getByText('Excluir Conta')).toBeTruthy();
    expect(getByText('Sair da Conta')).toBeTruthy();

    expect(queryByText('Tem certeza que deseja sair da conta?')).toBeNull();
  });
  
  it('não deve exibir a seção Conta quando isLoggedIn for false', () => {
    setupHookMock({ isLoggedIn: false });

    const { queryByText } = render(
      <SettingsScreen navigation={mockNavigation} />
    );

    expect(queryByText('Conta')).toBeNull();
    expect(queryByText('Sair da Conta')).toBeNull();
    expect(queryByText('Falar com o Suporte')).toBeTruthy(); 
    expect(queryByText('Geral')).toBeTruthy(); 
    expect(queryByText('Aparência')).toBeTruthy(); 
  });
  
  it('deve exibir a mensagem de erro ao falhar a redefinição de senha', () => {
    setupHookMock({
      errors: { passwordReset: 'Erro ao enviar o link de redefinição.', emailReset: '', logout: '' },
    });

    const { getByText } = render(<SettingsScreen navigation={mockNavigation} />);

    expect(getByText('Erro ao enviar o link de redefinição.')).toBeTruthy();
  });

  it('deve exibir a mensagem de sucesso ao enviar redefinição de senha', () => {
    setupHookMock({
      success: { passwordReset: 'O link de redefinição foi enviado!', emailReset: '', logout: '' },
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
      modalConfig: { visible: true, title: 'Atenção!', message: 'Tem certeza que deseja sair da conta?', type: 'logout', hideCancel: false },
    });

    const { getByText } = render(<SettingsScreen navigation={mockNavigation} />);

    expect(getByText('Tem certeza que deseja sair da conta?')).toBeTruthy();

    fireEvent.press(getByText('Cancelar'));
    expect(mockCancelLogout).toHaveBeenCalledTimes(1);

    fireEvent.press(getByText('Confirmar'));
    expect(mockConfirmLogout).toHaveBeenCalledTimes(1);
  });
});