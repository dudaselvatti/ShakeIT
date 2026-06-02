import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsScreen } from './index';

const mockNavigate = jest.fn();
const mockHandleAlterarSenha = jest.fn();
const mockHandleLogout = jest.fn();
const mockCancelLogout = jest.fn();
const mockConfirmLogout = jest.fn();

let mockIsModalVisible = false;

jest.mock('./SettingsViewModel', () => ({
    useSettingsViewModel: () => ({
        isModalVisible: mockIsModalVisible,
        handleAlterarSenha: mockHandleAlterarSenha,
        handleLogout: mockHandleLogout,
        cancelLogout: mockCancelLogout,
        confirmLogout: mockConfirmLogout,
    }),
}));

describe('SettingsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockIsModalVisible = false;
    });

    it('deve renderizar a tela de configurações com os componentes principais', () => {
        const { getByText } = render(<SettingsScreen navigation={{ navigate: mockNavigate }} />);

        expect(getByText('Configurações')).toBeTruthy();
        expect(getByText('Conta')).toBeTruthy();
        expect(getByText('Alterar Senha')).toBeTruthy();
        expect(getByText('Sair da Conta')).toBeTruthy();
    });

    it('deve chamar handleAlterarSenha ao clicar na opção de alterar senha', () => {
        const { getByText } = render(<SettingsScreen navigation={{ navigate: mockNavigate }} />);
        
        const alterarSenhaOption = getByText('Alterar Senha');
        fireEvent.press(alterarSenhaOption);

        expect(mockHandleAlterarSenha).toHaveBeenCalledTimes(1);
    });

    it('deve chamar handleLogout ao clicar em Sair da Conta', () => {
        const { getByText } = render(<SettingsScreen navigation={{ navigate: mockNavigate }} />);
        
        const botaoSair = getByText('Sair da Conta');
        fireEvent.press(botaoSair);

        expect(mockHandleLogout).toHaveBeenCalledTimes(1);
    });

    it('deve exibir o modal e responder aos comandos de confirmar e cancelar', () => {
        mockIsModalVisible = true;

        const { getByText } = render(<SettingsScreen navigation={{ navigate: mockNavigate }} />);

        expect(getByText('Atenção!')).toBeTruthy();
        expect(getByText('Tem certeza que deseja sair da conta?')).toBeTruthy();

        const botaoCancelar = getByText('Cancelar');
        fireEvent.press(botaoCancelar);
        expect(mockCancelLogout).toHaveBeenCalledTimes(1);

        const botaoConfirmar = getByText('Confirmar');
        fireEvent.press(botaoConfirmar);
        expect(mockConfirmLogout).toHaveBeenCalledTimes(1);
    });
});