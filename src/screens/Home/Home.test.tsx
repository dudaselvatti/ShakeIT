import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from './index';
import { useHomeViewModel } from './HomeViewModel';

jest.mock('./HomeViewModel');

const mockParties = [
  { id: 1, name: 'Natal 2026', status: 'Sorteio Realizado', eventDate: '2026-10-26' },
  { id: 2, name: 'Firma 2026', status: 'Aguardando Sorteio', eventDate: '2026-10-26' },
  { id: 3, name: 'Grupo de amigos 2026', status: 'Fim do evento', eventDate: '2026-02-17' },
];

describe('HomeScreen', () => {
  const mockHandleCardPress = jest.fn();
  const mockHandleCreateParty = jest.fn();

  beforeEach(() => {
    (useHomeViewModel as jest.Mock).mockReturnValue({
      parties: mockParties,
      handleCardPress: mockHandleCardPress,
      handleCreateParty: mockHandleCreateParty,
      userName: 'Carlos',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a saudação com o nome do usuário corretamente', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Olá, Carlos!')).toBeTruthy();
  });

  it('deve renderizar a lista de festas corretamente', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Natal 2026')).toBeTruthy();
    expect(getByText('Firma 2026')).toBeTruthy();
  });

  it('deve chamar handleCardPress quando um card de festa for pressionado', () => {
    const { getByText } = render(<HomeScreen />);
    const firstCard = getByText('Natal 2026'); 
    fireEvent.press(firstCard);
    expect(mockHandleCardPress).toHaveBeenCalledWith(mockParties[0]);
  });

  it('deve chamar handleCreateParty quando o botão FAB for pressionado', () => {
    const { getByTestId } = render(<HomeScreen />);
    
    const fabButton = getByTestId('fab-button');
    
    fireEvent.press(fabButton);
    expect(mockHandleCreateParty).toHaveBeenCalled();
  });

  it('deve exibir a lista vazia se não houver festas', () => {
    (useHomeViewModel as jest.Mock).mockReturnValue({
      parties: [],
      handleCardPress: mockHandleCardPress,
      handleCreateParty: mockHandleCreateParty,
      userName: 'Carlos',
    });

    const { queryByText } = render(<HomeScreen />);
    expect(queryByText('Natal 2026')).toBeNull();
  });
});