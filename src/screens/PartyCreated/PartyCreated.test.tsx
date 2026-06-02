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
    event_date: new Date().toISOString(),
    min_value: 50,
    max_value: 100,
    admin_id: '550e8400-e29b-41d4-a716-446655440001',
    invite_code: "#IDKFA2",
    status: 'aguardando_sorteio',
    block_dependent_draw: false,
    allow_wishlist_changes_after_draw: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
    expect(getByText('Status: aguardando_sorteio')).toBeTruthy();
    expect(getByText('Valores: R$ 50 - R$ 100')).toBeTruthy();
  });

  it('deve chamar a função voltarParaHome ao pressionar o botão', () => {
    const { getByText } = render(<PartyCreatedScreen />);

    const botaoHome = getByText('Ir para a Home');
    fireEvent.press(botaoHome);

    expect(mockVoltarParaHome).toHaveBeenCalledTimes(1);
  });
});
