import React from 'react';
import { render } from '@testing-library/react-native';
import { AppHeader } from './index';
import { useAppHeaderViewModel, Props } from './AppHeaderViewModel';

jest.mock('./AppHeaderViewModel', () => ({
  useAppHeaderViewModel: jest.fn(),
}));

jest.mock('../ReturnHomeArrow', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    ReturnHomeArrow: () => <View testID="mock-return-arrow" />,
  };
});

describe('AppHeader Component', () => {
  const mockProps: Props = {
    headerTitle: 'Default Title',
  };

  it('deve renderizar o título corretamente baseado no ViewModel', () => {
    const expectedTitle = 'Página Inicial';

    (useAppHeaderViewModel as jest.Mock).mockReturnValue({
      title: expectedTitle,
    });

    const { getByText } = render(<AppHeader {...mockProps} />);

    expect(getByText(expectedTitle)).toBeTruthy();
  });

  it('deve conter o componente de seta de retorno', () => {
    (useAppHeaderViewModel as jest.Mock).mockReturnValue({
      title: 'Teste',
    });

    const { getByTestId } = render(<AppHeader {...mockProps} />);

    expect(getByTestId('mock-return-arrow')).toBeTruthy();
  });

  it('deve aplicar os estilos corretos ao container e ao título', () => {
    (useAppHeaderViewModel as jest.Mock).mockReturnValue({
      title: 'Estilo',
    });

    const { getByText } = render(<AppHeader {...mockProps} />);
    const titleElement = getByText('Estilo');

    expect(titleElement.props.style).toEqual(
      expect.objectContaining({
        color: '#1A1D1E',
        fontSize: 18,
        textAlign: 'center',
      })
    );
  });
});