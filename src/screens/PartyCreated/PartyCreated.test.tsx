import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PartyCreatedScreen } from './index';
import { Party } from '../../types/Party';
import { usePartyCreatedViewModel } from './PartyCreatedViewModel';

jest.mock('./PartyCreatedViewModel');

describe('Tela PartyCreated', () => {
  const mockVoltarParaHome = jest.fn();

  const mockParty: Party = {
    id: 'teste123',
    name: 'Festa da Empresa',
    eventDate: new Date().toISOString(),
    minPrice: 50,
    maxPrice: 100,
    maxParticipants: 10,
    status: 'Aguardando Sorteio'
  };

  beforeEach(() => {
    (usePartyCreatedViewModel as jest.Mock).mockReturnValue({
      party: mockParty,
      voltarParaHome: mockVoltarParaHome,
    });
  });

  it('deve renderizar os dados da party vindos do ViewModel', () => {
    const { getByText } = render(<PartyCreatedScreen />);

    expect(getByText('Party Criada!')).toBeTruthy();
    expect(getByText('ID: teste123')).toBeTruthy();
    expect(getByText('Nome: Festa da Empresa')).toBeTruthy();
    expect(getByText('Status: Aguardando Sorteio')).toBeTruthy();
    expect(getByText('Valores: R$ 50 - R$ 100')).toBeTruthy();
  });

  it('deve chamar a função voltarParaHome ao pressionar o botão', () => {
    const { getByText } = render(<PartyCreatedScreen />);
    
    const botaoHome = getByText('Ir para a Home');
    fireEvent.press(botaoHome);

    expect(mockVoltarParaHome).toHaveBeenCalledTimes(1);
  });
});