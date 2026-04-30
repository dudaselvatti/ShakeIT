import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ShakeRevealScreen } from './index';
import { useShakeRevealViewModel } from './ShakeRevealViewModel';

jest.mock('./ShakeRevealViewModel');

jest.mock('../../components/Button', () => {
  const { Text } = require('react-native');
  return {
    Button: ({ title, onPress }: any) => (
      <Text onPress={onPress}>{title}</Text>
    ),
  };
});

describe('ShakeRevealScreen', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockSimularShake = jest.fn();
  
  const mockShakeAnimation = {
    interpolate: jest.fn(() => 0),
    setValue: jest.fn(),
    _getPath: () => [], 
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useShakeRevealViewModel as jest.Mock).mockReturnValue({
      shakeAnimation: mockShakeAnimation,
      simularShake: mockSimularShake,
    });
  });

  it('deve renderizar os textos informativos corretamente', () => {
    const { getByText } = render(<ShakeRevealScreen navigation={mockNavigation} />);

    expect(getByText('O Sorteio realizado!')).toBeTruthy();
    expect(getByText('Chacoalhe o celular para descobrir o seu amigo secreto...')).toBeTruthy();
  });

  it('deve renderizar o emoji de presente', () => {
    const { getByText } = render(<ShakeRevealScreen navigation={mockNavigation} />);
    expect(getByText('🎁')).toBeTruthy();
  });

  it('deve chamar a função simularShake ao pressionar o botão', () => {
    const { getByText } = render(<ShakeRevealScreen navigation={mockNavigation} />);
    
    const button = getByText('Simular Shake (Mock T08)');
    fireEvent.press(button);

    expect(mockSimularShake).toHaveBeenCalledTimes(1);
  });
});