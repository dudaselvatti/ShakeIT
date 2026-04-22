import React from 'react';
import { render } from '@testing-library/react-native';
import { BotaoTeste } from '../BotaoTeste';

describe('Componente BotaoTeste', () => {
  it('deve renderizar o texto de sucesso corretamente', () => {
    const { getByText } = render(<BotaoTeste />);
    
    const textoDoBotao = getByText('Ambiente Configurado com Sucesso!');
    
    expect(textoDoBotao).toBeTruthy();
  });
});