import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ShakeRevealScreen } from './index';

describe('Ecrã ShakeReveal (Tela 6)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
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

  it('deve navegar para a Tela 7 (RevealResult) ao clicar no botão de simulação', () => {
    const mockNavigation = { navigate: jest.fn() };
    const { getByText } = render(<ShakeRevealScreen navigation={mockNavigation} />);

    const mockButton = getByText('Simular Shake (Mock T08)');
    fireEvent.press(mockButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('RevealResult');
  });
});