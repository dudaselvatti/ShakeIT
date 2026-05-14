import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { PartyPreviewScreen } from './index';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: { partyCode: '#NATAL55' } }),
}));

describe('Tela PartyPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('deve renderizar as informações corretas da Party', () => {
    const { getByText } = render(<PartyPreviewScreen />);

    expect(getByText('Firma 2026')).toBeTruthy();
    expect(getByText('R$ 50,00 a R$ 100,00')).toBeTruthy();
    expect(getByText('Perfil Pendente')).toBeTruthy();
  });

  it('deve navegar para a próxima tela ao clicar em "Confirmar Entrada"', () => {
    const { getByText } = render(<PartyPreviewScreen />);

    fireEvent.press(getByText('Confirmar Entrada'));

    expect(mockNavigate).toHaveBeenCalledWith('ParticipantLobby', { partyId: 'mock1' });
  });

  it('deve abrir o modal de atenção ao clicar em "Voltar ao Início"', () => {
    const { getByText, queryByText } = render(<PartyPreviewScreen />);

    // Garante que o texto do modal existe
    fireEvent.press(getByText('Voltar ao Início'));

    expect(getByText('Seu perfil ainda não foi lockado para o sorteio, mas você já ingressou na party. Deseja realmente voltar?')).toBeTruthy();
  });

  it('deve fechar o modal ao clicar em "Cancelar"', () => {
    const { getByText, queryByText } = render(<PartyPreviewScreen />);

    // Abre o modal
    fireEvent.press(getByText('Voltar ao Início'));
    
    // Clica em Cancelar
    fireEvent.press(getByText('Cancelar'));

    // Verifica que não houve navegação
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('deve fechar o modal e navegar para a Home ao clicar em "Voltar para Home"', () => {
    const { getByText } = render(<PartyPreviewScreen />);

    // Abre o modal
    fireEvent.press(getByText('Voltar ao Início'));
    
    // Clica em Confirmar (Voltar para Home)
    fireEvent.press(getByText('Voltar para Home'));

    // Avança o timeout do setTimeout interno do handleConfirmModal
    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });
});
