import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsOption } from './index';
import { useSettingsOptionViewModel } from './SettingsOptionViewModel';

jest.mock('./SettingsOptionViewModel', () => ({
  useSettingsOptionViewModel: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

describe('SettingsOption Component', () => {
  const mockOnPress = jest.fn();
  
  const mockViewModelProps = {
    title: 'Minha Conta',
    iconName: 'user' as const,
    iconSize: 24,
    iconColor: '#000',
    onPress: mockOnPress,
    children: <Text>Conteúdo Extra</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSettingsOptionViewModel as jest.Mock).mockReturnValue(mockViewModelProps);
  });

  it('deve renderizar o título e o ícone corretamente', () => {
    const { getByText } = render(
      <SettingsOption title="Minha Conta" iconName="user" />
    );

    expect(getByText('Minha Conta')).toBeTruthy();
  });

  it('deve renderizar os elementos filhos (children) corretamente', () => {
    const { getByText } = render(
      <SettingsOption title="Minha Conta" iconName="user" />
    );

    expect(getByText('Conteúdo Extra')).toBeTruthy();
  });

  it('deve repassar as propriedades do TouchableOpacity e responder ao clique', () => {
    const { getByRole } = render(
      <SettingsOption title="Minha Conta" iconName="user" />
    );

    const touchableElement = getByRole('button');
    
    fireEvent.press(touchableElement);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});