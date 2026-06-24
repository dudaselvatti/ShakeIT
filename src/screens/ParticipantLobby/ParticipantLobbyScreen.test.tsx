import React from 'react';
import { render } from '@testing-library/react-native';
import { ParticipantLobbyScreen } from './index';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: { partyId: 'mock1' } }),
}));

jest.mock('../../services/cloud/PartyParticipant/PartyParticipantDb', () => ({
  getParticipantsByPartyId: jest.fn(() => Promise.resolve([
      {
          usuario: { id: '550e8400-e29b-41d4-a716-446655440001', nome: "João" },
          perfil: { id: '550e8400-e29b-41d4-a716-556655440001', status: 'confirmado' }
      },
      {
          usuario: { id: '550e8400-e29b-41d4-a716-446655440002', nome: "Maria" },
          perfil: { id: '550e8400-e29b-41d4-a716-556655440002', status: 'pendente' }
      }
  ]))
}));

describe('Tela ParticipantLobby', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a sala de espera com cabeçalho e contagem de participantes correta', async () => {
    const { getByText, findByText } = render(<ParticipantLobbyScreen />);

    // Verifica o texto de espera
    expect(getByText('Aguardando o organizador iniciar o sorteio...')).toBeTruthy();

    // 1 confirmado de 2 totais no mock
    expect(await findByText(/Participantes \(1\/2\)/)).toBeTruthy();
  });

  it('garante segurança de UI não renderizando botão de Sorteio ou QR Code do Admin', async () => {
    const { queryByText, findByText } = render(<ParticipantLobbyScreen />);

    await findByText(/Participantes \(1\/2\)/);

    // Não deve existir botões ou convites do PartyAdmin
    expect(queryByText('Realizar Sorteio')).toBeNull();
    expect(queryByText('Código:')).toBeNull();
  });
});
