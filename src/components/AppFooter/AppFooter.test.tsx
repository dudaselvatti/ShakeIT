import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppFooter } from './index';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
  useRoute: () => ({
    name: 'MockScreen',
  }),
}));



describe('Componente: AppFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve navegar para a Home quando clicar em Parties (home)', () => {
    const { getByTestId } = render(<AppFooter />);
    fireEvent.press(getByTestId('icon-button-home'));
    expect(mockNavigate).toHaveBeenCalledWith('Home', { animation: 'slide_from_right' });
  });

  it('deve navegar para Scan quando clicar no ícone correspondente', () => {
    const { getByTestId } = render(<AppFooter />);
    fireEvent.press(getByTestId('icon-button-maximize'));
    expect(mockNavigate).toHaveBeenCalledWith('Scan', { animation: 'slide_from_right' });
  });

  it('deve navegar para MeuPerfil quando clicar no ícone de usuário', () => {
    const { getByTestId } = render(<AppFooter />);
    fireEvent.press(getByTestId('icon-button-user'));
    expect(mockNavigate).toHaveBeenCalledWith('MeuPerfil', { animation: 'slide_from_right' });
  });
});