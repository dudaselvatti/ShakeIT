import React from 'react';
import { render } from '@testing-library/react-native';
import { PartyCreatedScreen } from './index';

describe('Ecrã PartyCreated', () => {
  it('deve renderizar a mensagem de sucesso no ecrã', () => {
    const { getByText } = render(<PartyCreatedScreen />);
    
    // Verifica se os textos principais estão a ser exibidos
    expect(getByText('Party Criada com Sucesso!')).toBeTruthy();
    expect(getByText('(Tela 3.1 Provisória)')).toBeTruthy();
  });
});