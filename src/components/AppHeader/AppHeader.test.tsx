import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { AppHeader } from './index';
import { useAppHeaderViewModel, Props } from './AppHeaderViewModel';

jest.mock('./AppHeaderViewModel', () => ({
  useAppHeaderViewModel: jest.fn(),
}));

const MockView = (props: any) => <View {...props} />;

jest.mock('../IconButton', () => ({
  IconButton: ({ iconName }: any) => <MockView testID={`icon-button-${iconName}`} />,
}));

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

  it('deve exibir os ícones de back e settings condicionalmente', () => {
    (useAppHeaderViewModel as jest.Mock).mockReturnValue({
      title: 'Teste',
      showBackButton: true,
      showSettingsIcon: true,
    });

    const { getByTestId } = render(<AppHeader {...mockProps} />);

    expect(getByTestId('icon-button-chevron-left')).toBeTruthy();
    expect(getByTestId('icon-button-settings')).toBeTruthy();
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