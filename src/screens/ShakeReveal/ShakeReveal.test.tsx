import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ShakeRevealScreen } from './index';
import { Vibration } from 'react-native';

jest.mock('expo-sensors', () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});

describe('Ecrã ShakeReveal (Tela 6)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('deve renderizar os textos de instrução visual e a caixa de presente', () => {
    const { getByText } = render(<ShakeRevealScreen navigation={{}} />);

    expect(getByText('O Sorteio realizado!')).toBeTruthy();
    expect(getByText('Chacoalhe o celular para descobrir o seu amigo secreto...')).toBeTruthy();
    expect(getByText('🎁')).toBeTruthy();
  });

  it('deve vibrar, acionar explosao e navegar para a Tela 7 ao detetar o shake (simulado)', () => {
    const mockNavigation = { navigate: jest.fn() };
    const { getByText, queryByText } = render(<ShakeRevealScreen navigation={mockNavigation} />);

    const mockButton = getByText('🛠 Simular Shake Físico');
    
    fireEvent.press(mockButton);

    expect(Vibration.vibrate).toHaveBeenCalledWith(500);

    expect(queryByText('🛠 Simular Shake Físico')).toBeNull();

    expect(getByText('Preparando a surpresa...')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('RevealResult');
  });
});