import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { ShakeRevealScreen } from './index';
import { Vibration } from 'react-native';
import { participantesMock } from '../../mocks/participantesMock';

let accelerometerListener: ((data: any) => void) | null = null;

jest.mock('expo-sensors', () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn((listener) => {
      accelerometerListener = listener;
      return { remove: jest.fn() };
    }),
  },
}));

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    usuarioAtual: { id: 'user-A', nome: 'Duda' },
  })),
}));

jest.mock('../../services/cloud/PartyParticipant/PartyParticipantDb', () => ({
  getPartyParticipantByUserIdAndPartyId: jest.fn(() => Promise.resolve({
    perfil: { id: 'profile-A' }
  })),
  updatePartyParticipant: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../services/cloud/DrawResult/DrawResultDb', () => ({
  getDrawResultByGiverProfileId: jest.fn(() => Promise.resolve({
    receiver_profile_id: '550e8400-e29b-41d4-a716-446655440001'
  })),
}));

jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});

describe('Ecrã ShakeReveal (Tela 6)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    accelerometerListener = null;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('deve renderizar os textos de instrução visual e a caixa de presente', () => {
    const { getByText } = render(<ShakeRevealScreen route={{ params: { partyId: "party-id" } }} navigation={{}} />);

    expect(getByText('O Sorteio realizado!')).toBeTruthy();
    expect(getByText('Chacoalhe o celular para descobrir o seu amigo secreto...')).toBeTruthy();
    expect(getByText('🎁')).toBeTruthy();
  });

  it('deve vibrar, acionar explosao e navegar para a Tela 7 ao detetar shake real pelo sensor', async () => {
    const mockNavigation = { navigate: jest.fn() };
    const { getByText } = render(<ShakeRevealScreen route={{ params: { partyId: "party-id" } }} navigation={mockNavigation} />);

    expect(accelerometerListener).toBeTruthy();

    act(() => {
      if (accelerometerListener) {
        accelerometerListener({ x: 3, y: 0, z: 0 });
      }
    });

    expect(Vibration.vibrate).toHaveBeenCalledWith(500);
    
    expect(getByText('Preparando a surpresa...')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    const expectedId = participantesMock[0]?.usuario.id || "550e8400-e29b-41d4-a716-446655440001";
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('PerfilSorteado', { idPerfil: expectedId });
    });
  });
});