import React from 'react';
import { render } from '@testing-library/react-native';
import { ParticipantLobbyScreen } from './index';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: { partyId: 'mock1' } }),
}));

jest.mock('../../mocks/participantesMock', () => ({
    participantesMock: [
        {
            usuario: { id: 1, nome: "João" },
            perfil: { id: 1, isConfirmado: true }
        },
        {
            usuario: { id: 2, nome: "Maria" },
            perfil: { id: 2, isConfirmado: false }
        }
    ]
}));

describe('Tela ParticipantLobby', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a sala de espera com cabeçalho e contagem de participantes correta', () => {
    const { getByText } = render(<ParticipantLobbyScreen />);

    // Verifica o texto de espera
    expect(getByText('Aguardando o organizador iniciar o sorteio...')).toBeTruthy();

    // 1 confirmado de 2 totais no mock
    expect(getByText('Participantes na Sala (1/2)')).toBeTruthy();
  });

  it('garante segurança de UI não renderizando botão de Sorteio ou QR Code do Admin', () => {
    const { queryByText, queryByTestId } = render(<ParticipantLobbyScreen />);

    // Não deve existir botões ou convites do PartyAdmin
    expect(queryByText('Realizar Sorteio')).toBeNull();
    expect(queryByText('Código:')).toBeNull();
  });
});
