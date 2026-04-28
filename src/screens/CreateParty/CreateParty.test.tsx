import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreatePartyScreen } from './index';

jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = jest.requireActual('react-native');
  const MockDateTimePicker = (props: any) => <View testID="mock-date-picker" {...props} />;
  MockDateTimePicker.displayName = 'MockDateTimePicker';
  return MockDateTimePicker;
});

jest.mock('../../components/IconButton', () => {
  const { TouchableOpacity } = jest.requireActual('react-native');
  const MockIconButton = ({ onPress }: any) => (
    <TouchableOpacity testID="btn-voltar" onPress={onPress} />
  );
  MockIconButton.displayName = 'MockIconButton';
  return { IconButton: MockIconButton };
});

describe('Tela CreateParty', () => {
  it('deve navegar para a próxima tela apenas se o Nome da Party for preenchido', () => {
  const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
  const { getByText, getByPlaceholderText } = render(
    <CreatePartyScreen navigation={mockNavigation} />
  );

  const button = getByText('Criar Party');
  const nameInput = getByPlaceholderText('Ex: Amigo Secreto da Firma');

  fireEvent.press(button);
  expect(mockNavigation.navigate).not.toHaveBeenCalled();

  const nomeTeste = 'Natal 2026';
  fireEvent.changeText(nameInput, nomeTeste);
  fireEvent.press(button);

  expect(mockNavigation.navigate).toHaveBeenCalledWith('PartyAdmin', {
    partyName: nomeTeste, 
    partyCode: expect.any(String) 
  });
});

  it('deve abrir o modal ao clicar em voltar e fechar ao clicar em Cancelar', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByTestId, getByText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('btn-voltar'));

    fireEvent.press(getByText('Cancelar'));
    
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
  });

  it('deve voltar à ecrã anterior ao confirmar a saída no modal', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByTestId, getByText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('btn-voltar'));

    fireEvent.press(getByText('Sair sem salvar'));
    
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});