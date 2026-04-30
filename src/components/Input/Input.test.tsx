import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './index';

describe('Componente Input', () => {
  it('deve renderizar a label e o placeholder corretamente', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Nome da Party" placeholder="Digite o nome" />
    );
    
    expect(getByText('Nome da Party')).toBeTruthy();
    expect(getByPlaceholderText('Digite o nome')).toBeTruthy();
  });

  it('deve chamar a função onChangeText quando o utilizador digita', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input label="Teste" placeholder="Digite aqui" onChangeText={mockOnChangeText} />
    );

    const inputElement = getByPlaceholderText('Digite aqui');
    
    fireEvent.changeText(inputElement, 'Festa');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('Festa');
  });
});