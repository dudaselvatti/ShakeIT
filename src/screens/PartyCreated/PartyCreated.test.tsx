import React from 'react';
import { render } from '@testing-library/react-native';
import { PartyCreatedScreen } from './index';
import { Party } from '../../types/Party';

describe('Ecrã PartyCreated', () => {
  it('deve renderizar a mensagem de sucesso e os dados da party', () => {
    const mockParty: Party = {
      id: 'teste123',
      name: 'Festa da Empresa',
      eventDate: new Date().toISOString(),
      minPrice: 50,
      maxPrice: 100,
      maxParticipants: 10,
      status: 'Aguardando Sorteio'
    };

    const mockRoute = { params: { party: mockParty } };
    const mockNavigation = { navigate: jest.fn() };

    const { getByText } = render(
      <PartyCreatedScreen route={mockRoute} navigation={mockNavigation} />
    );
    
    expect(getByText('Party Criada!')).toBeTruthy();
    expect(getByText('Nome: Festa da Empresa')).toBeTruthy();
    expect(getByText('Valores: R$ 50 - R$ 100')).toBeTruthy();
  });
});