import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreatePartyScreen } from './index';

// Mock do DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = jest.requireActual('react-native');
  const MockDateTimePicker = (props: any) => <View testID="mock-date-picker" {...props} />;
  MockDateTimePicker.displayName = 'MockDateTimePicker';
  return MockDateTimePicker;
});

// Mock do IconButton
jest.mock('../../components/IconButton', () => {
  const { TouchableOpacity } = jest.requireActual('react-native');
  const MockIconButton = ({ onPress }: any) => (
    <TouchableOpacity testID="btn-voltar" onPress={onPress} />
  );
  MockIconButton.displayName = 'MockIconButton';
  return { IconButton: MockIconButton };
});

describe('Ecrã CreateParty', () => {
  it('deve navegar para a próxima ecrã apenas se o Nome da Party for preenchido', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    const button = getByText('Criar Party');
    const nameInput = getByPlaceholderText('Ex: Amigo Secreto da Firma');

    fireEvent.press(button);
    expect(mockNavigation.navigate).not.toHaveBeenCalled();

    fireEvent.changeText(nameInput, 'Festa de Natal');
    fireEvent.press(button);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('PartyCreated');
  });

  it('deve abrir o modal ao clicar em voltar e fechar ao clicar em Cancelar', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByTestId, getByText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    // 1. Simula o clique no botão de voltar
    fireEvent.press(getByTestId('btn-voltar'));

    // 2. Simula o clique no botão "Cancelar" do modal
    fireEvent.press(getByText('Cancelar'));
    
    // Verifica que a navegação para voltar NÃO foi chamada
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
  });

  it('deve voltar à ecrã anterior ao confirmar a saída no modal', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByTestId, getByText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    // 1. Simula o clique no botão de voltar
    fireEvent.press(getByTestId('btn-voltar'));

    // 2. Simula o clique no botão "Sair sem salvar" do modal
    fireEvent.press(getByText('Sair sem salvar'));
    
    // Verifica que a função de voltar na navegação FOI chamada
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});