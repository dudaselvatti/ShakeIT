import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PartyCard } from './index';
import { usePartyCardViewModel } from './PartyCardViewModel';

jest.mock('./PartyCardViewModel');

const mockProps = {
  id: '1',
  name: 'Natal 1959',
  eventdate: '1959-05-20',
  status: 'Aguardando Sorteio',
  onPress: jest.fn(),
};

const mockViewModelValues = {
  title: 'Firma 2026',
  statusLabel: 'Sorteio Realizado',
  eventDate: '2026-04-29',
  statusIcon: 'check-circle' as any,
  tagColor: '#00FF00',
  onPress: mockProps.onPress,
};

describe('PartyCard Component', () => {
  beforeEach(() => {
    (usePartyCardViewModel as jest.Mock).mockReturnValue(mockViewModelValues);
  });

  it('deve renderizar os dados corretamente baseados no ViewModel', () => {
    const { getByText } = render(<PartyCard {...mockProps} />);

    expect(getByText('Firma 2026')).toBeTruthy();
    expect(getByText('2026-04-29')).toBeTruthy();
    expect(getByText('Sorteio Realizado')).toBeTruthy();
  });

  it('deve chamar a função onPress quando o card for pressionado', () => {
    const { getByRole } = render(<PartyCard {...mockProps} />);
    
    const touchable = getByRole('button'); 
    
    fireEvent.press(touchable);

    expect(mockProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('deve exibir o ícone correto', () => {
    const { getByTestId } = render(<PartyCard {...mockProps} />);
    
    const icon = getByTestId('party-card-icon');
    
    expect(icon).toBeTruthy();
    
    expect(icon.props.name).toBe('check-circle');
  });
});