import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { ShakeRevealScreen } from './index';
import { Vibration } from 'react-native';

// 1. Mock do Acelerómetro
jest.mock('expo-sensors', () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

// 2. Usamos o spyOn no lugar do jest.mock para interceptar a Vibração de forma segura!
jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});

describe('Ecrã ShakeReveal (Tela 6)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks(); // Limpa chamadas anteriores
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
    
    // Clica no botão para iniciar a lógica
    fireEvent.press(mockButton);

    // 1. Verifica se a vibração foi chamada corretamente (500ms)
    expect(Vibration.vibrate).toHaveBeenCalledWith(500);

    // 2. O botão de Mock deve sumir após o clique
    expect(queryByText('🛠 Simular Shake Físico')).toBeNull();

    // 3. O texto deve mudar para preparar a surpresa
    expect(getByText('Preparando a surpresa...')).toBeTruthy();

    // 4. Avança o tempo da animação de explosão (600ms configurados no ViewModel)
    act(() => {
      jest.advanceTimersByTime(600);
    });

    // 5. Após a animação, verifica se a navegação ocorreu
    expect(mockNavigation.navigate).toHaveBeenCalledWith('RevealResult');
  });
});