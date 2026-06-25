import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PartyCreatedScreen } from './index';
import { Party } from '../../types/Party';
import { usePartyCreatedViewModel } from './PartyCreatedViewModel';

jest.mock('./PartyCreatedViewModel');

jest.mock('../../utils/Formatting/formatDate', () => ({
  formatDate: jest.fn(() => '25/12/2026')
}));

jest.mock('../../utils/Formatting/formatCurrency', () => ({
  formatCurrency: jest.fn((val) => val.toString())
}));

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
    expect(getByText('Festa da Empresa')).toBeTruthy();
    expect(getByText('Data: 25/12/2026')).toBeTruthy();
    expect(getByText('Valores: R$ 50 - R$ 100')).toBeTruthy();
  });

  it('deve chamar a função voltarParaHome ao pressionar o botão', () => {
    const { getByText } = render(<PartyCreatedScreen />);

    const botaoHome = getByText('Ir para a Home');
    fireEvent.press(botaoHome);

    expect(mockVoltarParaHome).toHaveBeenCalledTimes(1);
  });
});
