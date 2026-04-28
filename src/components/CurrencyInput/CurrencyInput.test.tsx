import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CurrencyInput } from './index';

describe('Componente CurrencyInput', () => {
  it('deve aplicar a máscara monetária corretamente', () => {
    const mockOnChangeText = jest.fn();
    const { getByTestId } = render(
      <CurrencyInput 
        label="Valor" 
        onChangeText={mockOnChangeText} 
        testID="currency-input" // Usamos testID para encontrar facilmente o TextInput nativo
      />
    );

    const inputElement = getByTestId('currency-input');

    // Simula digitar "1234" (esperamos "12,34")
    fireEvent.changeText(inputElement, '1234');
    expect(mockOnChangeText).toHaveBeenCalledWith('12,34');

    // Simula digitar "1234567" (esperamos "12.345,67")
    fireEvent.changeText(inputElement, '1234567');
    expect(mockOnChangeText).toHaveBeenCalledWith('12.345,67');
  });
});