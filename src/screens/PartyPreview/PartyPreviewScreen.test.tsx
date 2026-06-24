import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { PartyPreviewScreen } from './index';
import { AppFooter } from '../../components/AppFooter';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: { partyCode: '#NATAL55' } }),
}));
jest.mock('../../services/cloud/Party/PartyDb', () => ({
  getPartyByInviteCodeFromCloud: jest.fn(() => Promise.resolve({
    id: 'mock1',
    name: 'Firma 2026',
    min_value: 50,
    max_value: 100,
    event_date: '2026-12-20',
    status: 'aguardando_sorteio'
  }))
}));

jest.mock('../../services/cloud/PartyParticipant/PartyParticipantDb', () => ({
  getPartyParticipantByUserIdAndPartyId: jest.fn(() => Promise.resolve(null)),
  createPartyParticipant: jest.fn(() => Promise.resolve())
}));

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
  useAuth: () => ({ usuarioAtual: { id: 'user1', nome: 'Tester' } })
}));
jest.mock('../../components/AppFooter', () => ({
  AppFooter: jest.fn(() => null),
}));

const mockAppFooter = AppFooter as unknown as jest.Mock;

describe('Tela PartyPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('deve renderizar as informações corretas da Party', async () => {
    const { findByText } = render(<PartyPreviewScreen />);

    expect(await findByText('Firma 2026')).toBeTruthy();
    expect(await findByText('R$ 50,00 a R$ 100,00')).toBeTruthy();
    expect(await findByText('Perfil Pendente')).toBeTruthy();
  });

  it('deve navegar para a próxima tela ao clicar em "Confirmar Entrada"', async () => {
    const { getByText, findByText } = render(<PartyPreviewScreen />);

    fireEvent.press(await findByText('Confirmar Entrada'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('ParticipantLobby', { partyId: 'mock1' });
    });
  });

  it('deve abrir o modal de atenção ao clicar em "Voltar ao Início"', async () => {
    const { getByText, findByText } = render(<PartyPreviewScreen />);

    // Garante que o texto do modal existe
    fireEvent.press(await findByText('Voltar ao Início'));

    expect(getByText('Seu perfil ainda não foi lockado para o sorteio, mas você já ingressou na party. Deseja realmente voltar?')).toBeTruthy();
  });

  it('deve fechar o modal ao clicar em "Cancelar"', async () => {
    const { getByText, findByText } = render(<PartyPreviewScreen />);

    // Abre o modal
    fireEvent.press(await findByText('Voltar ao Início'));
    
    // Clica em Cancelar
    fireEvent.press(getByText('Cancelar'));

    // Verifica que não houve navegação
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('deve fechar o modal e navegar para a Home ao clicar em "Voltar para Home"', async () => {
    const { getByText, findByText } = render(<PartyPreviewScreen />);

    // Abre o modal
    fireEvent.press(await findByText('Voltar ao Início'));
    
    // Clica em Confirmar (Voltar para Home)
    fireEvent.press(getByText('Voltar para Home'));

    // Avança o timeout do setTimeout interno do handleConfirmModal
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('deve interceptar a navegação do rodapé, exibir o modal e navegar para a aba escolhida ao confirmar', async () => {
    const { getByText, findByText } = render(<PartyPreviewScreen />);
    
    await findByText('Firma 2026');

    // Disparar o onNavigateIntercept
    const testProps = mockAppFooter.mock.calls[mockAppFooter.mock.calls.length - 1][0];
    act(() => {
      testProps.onNavigateIntercept('MeuPerfil');
    });

    // Clica em Confirmar (Voltar para Home mas que agora vai pra MeuPerfil devido a navegação)
    fireEvent.press(await findByText('Voltar para Home'));

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(mockNavigate).toHaveBeenCalledWith('MeuPerfil');
  });
});
