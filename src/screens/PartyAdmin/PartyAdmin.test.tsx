import React from 'react';
import { Text as MockText } from 'react-native'; 
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PartyAdminScreen } from './index';
import { usePartyAdminViewModel } from './PartyAdminViewModel';

jest.mock('./PartyAdminViewModel');

jest.mock('../../components/AppHeader', () => ({
  AppHeader: ({ headerTitle }: any) => <MockText>{headerTitle}</MockText>,
}));

jest.mock('../../components/PartyQRCode', () => ({
  PartyQRCode: ({ partyCode }: any) => <MockText>QR: {partyCode}</MockText>,
}));

jest.mock('../../components/ParticipanteCard', () => ({
  ParticipanteCard: ({ participante }: any) => <MockText>{participante.usuario.nome}</MockText>,
}));

describe('PartyAdminScreen', () => {
  const mockHandleSorteioPress = jest.fn();
  
  const mockData = {
    partyName: 'Festa de Natal',
    partyCode: 'XMAS24',
    participantes: [
      { usuario: { id: 1, nome: 'Duda' }, perfil: { isConfirmado: true } },
      { usuario: { id: 2, nome: 'João' }, perfil: { isConfirmado: false } },
    ],
    confirmadosCount: 1,
    participantesTotal: 2,
    headerTitle: 'Painel do Evento',
    handleSorteioPress: mockHandleSorteioPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePartyAdminViewModel as jest.Mock).mockReturnValue(mockData);
  });

  it('deve renderizar o título do header corretamente', () => {
    render(<PartyAdminScreen />);
    expect(screen.getByText('Painel do Evento')).toBeTruthy();
  });

  it('deve exibir o nome da festa e o código', () => {
    render(<PartyAdminScreen />);
    expect(screen.getByText('Festa de Natal')).toBeTruthy();
    expect(screen.getByText('XMAS24')).toBeTruthy();
  });

  it('deve exibir o QR Code com o código correto', () => {
    render(<PartyAdminScreen />);
    expect(screen.getByText('QR: XMAS24')).toBeTruthy();
  });

  it('deve exibir o contador de perfis confirmados formatado', () => {
    render(<PartyAdminScreen />);
    expect(screen.getByText('Perfis confirmados (1/2)')).toBeTruthy();
  });

  it('deve renderizar a lista de participantes baseada nos dados do ViewModel', () => {
    render(<PartyAdminScreen />);
    expect(screen.getByText('Duda')).toBeTruthy();
    expect(screen.getByText('João')).toBeTruthy();
  });

  it('deve chamar handleSorteioPress ao clicar no botão de sorteio', () => {
    render(<PartyAdminScreen />);
    
    const botaoSorteio = screen.getByText('Realizar Sorteio');
    fireEvent.press(botaoSorteio);

    expect(mockHandleSorteioPress).toHaveBeenCalledTimes(1);
  });
});