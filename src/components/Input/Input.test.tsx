import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './index';

describe('Componente Input', () => {
  it('deve renderizar a label e o placeholder corretamente', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Nome da Party" placeholder="Digite o nome" />
    );
    
    // Verifica se os textos aparecem no ecrã
    expect(getByText('Nome da Party')).toBeTruthy();
    expect(getByPlaceholderText('Digite o nome')).toBeTruthy();
  });

  it('deve chamar a função onChangeText quando o utilizador digita', () => {
    const mockOnChangeText = jest.fn(); // Cria uma função "falsa" para o teste
    const { getByPlaceholderText } = render(
      <Input label="Teste" placeholder="Digite aqui" onChangeText={mockOnChangeText} />
    );

    const inputElement = getByPlaceholderText('Digite aqui');
    
    // Simula o utilizador a digitar "Festa"
    fireEvent.changeText(inputElement, 'Festa');
    
    // Verifica se a função foi chamada com o texto correto
    expect(mockOnChangeText).toHaveBeenCalledWith('Festa');
  });
});