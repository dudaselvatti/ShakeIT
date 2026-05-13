import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppFooter } from './index';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../IconButton', () => ({
  IconButton: ({ iconName, onPress }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} testID={`icon-${iconName}`}>
        <Text>{iconName}</Text>
      </TouchableOpacity>
    );
  }
}));

describe('Componente: AppFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve navegar para a Home quando clicar em Parties (home)', () => {
    const { getByTestId } = render(<AppFooter />);
    fireEvent.press(getByTestId('icon-home'));
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('deve navegar para Scan quando clicar no ícone correspondente', () => {
    const { getByTestId } = render(<AppFooter />);
    fireEvent.press(getByTestId('icon-maximize'));
    expect(mockNavigate).toHaveBeenCalledWith('Scan');
  });

  it('deve navegar para MeuPerfil quando clicar no ícone de usuário', () => {
    const { getByTestId } = render(<AppFooter />);
    fireEvent.press(getByTestId('icon-user'));
    expect(mockNavigate).toHaveBeenCalledWith('MeuPerfil');
  });
});