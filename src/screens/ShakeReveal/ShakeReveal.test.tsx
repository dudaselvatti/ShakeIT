import React from 'react';
import { render, act } from '@testing-library/react-native';
import { ShakeRevealScreen } from './index';
import { Vibration } from 'react-native';

let accelerometerListener: ((data: any) => void) | null = null;

jest.mock('expo-sensors', () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn((listener) => {
      accelerometerListener = listener;
      return { remove: jest.fn() };
    }),
  },
}));

jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});

describe('Ecrã ShakeReveal (Tela 6)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    accelerometerListener = null;
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

  it('deve vibrar, acionar explosao e navegar para a Tela 7 ao detetar shake real pelo sensor', () => {
    const mockNavigation = { navigate: jest.fn() };
    const { getByText } = render(<ShakeRevealScreen navigation={mockNavigation} />);

    expect(accelerometerListener).toBeTruthy();

    act(() => {
      if (accelerometerListener) {
        accelerometerListener({ x: 3, y: 0, z: 0 });
      }
    });

    expect(Vibration.vibrate).toHaveBeenCalledWith(500);
    
    expect(getByText('Preparando a surpresa...')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PerfilSorteado', { idUsuario: 1 });
  });
});