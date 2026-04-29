import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MockButton } from './index';

describe('Componente MockButton', () => {
  it('deve renderizar o título corretamente com o ícone de ferramenta', () => {
    const { getByText } = render(<MockButton title="Testar Navegação" onPress={jest.fn()} />);
    expect(getByText('🛠 Testar Navegação')).toBeTruthy();
  });

  it('deve chamar a função onPress ao ser clicado', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<MockButton title="Clicar" onPress={mockOnPress} />);
    
    fireEvent.press(getByText('🛠 Clicar'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});