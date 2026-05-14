import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreatePartyScreen } from './index';
import { createPartyInCloud } from '../../services/cloudDb/cloudDb';
import { Party } from '../../types/Party';

jest.mock('../../services/cloudDb/cloudDb', () => ({
  createPartyInCloud: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
}));

jest.mock('../../components/AppFooter', () => ({
  AppFooter: () => null,
}));

jest.mock('../../components/DateInput', () => ({
  DateInput: ({ label, onChangeDate }: any) => {
    const { View, Text, TouchableOpacity } = jest.requireActual('react-native');
    return (
      <View>
        <Text>{label}</Text>
        <TouchableOpacity 
          testID="btn-selecionar-data" 
          onPress={() => onChangeDate(new Date('2026-12-25T00:00:00.000Z'))}
        />
      </View>
    );
  }
}));

jest.mock('../../components/IconButton', () => {
  const { TouchableOpacity } = jest.requireActual('react-native');
  const MockIconButton = ({ onPress }: any) => (
    <TouchableOpacity testID="btn-voltar" onPress={onPress} />
  );
  MockIconButton.displayName = 'MockIconButton';
  return { IconButton: MockIconButton };
});

(createPartyInCloud as unknown as jest.Mock).mockResolvedValue({
  id: 'mockPartyId',
  name: 'Natal 2026',
  minPrice: 10,
  maxPrice: 50,
  idAdmin: 1,
  inviteCode: '#XYZ123',
  eventDate: '2026-12-25T00:00:00.000Z',
  status: 'Aguardando Sorteio',
});

describe('Tela CreateParty', () => {
  it('deve validar os campos vazios, exibir erros vermelhos e não navegar', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Amigo Secreto da Firma'), 'Natal 2026');

    fireEvent.press(getByText('Criar Party'));

    expect(getByText('Selecione a data da revelação.')).toBeTruthy();
    expect(getByText('Preencha o valor mínimo e máximo.')).toBeTruthy();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('deve instanciar o objeto Party e navegar com sucesso se tudo estiver correto', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Amigo Secreto da Firma'), 'Natal 2026');

    fireEvent.press(getByTestId('btn-selecionar-data'));

    fireEvent.changeText(getByPlaceholderText('0,00'), '1000'); 
    fireEvent.changeText(getByPlaceholderText('50,00'), '5000');

    await fireEvent.press(getByText('Criar Party'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PartyCreated', {
      party: expect.objectContaining({
        name: 'Natal 2026',
        minPrice: 10,
        maxPrice: 50,
        idAdmin: 1,
        inviteCode: '#XYZ123',
        eventDate: '2026-12-25T00:00:00.000Z',
        status: 'Aguardando Sorteio'
      })
    });
  });

  it('deve voltar à tela anterior ao confirmar a saída no modal', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByTestId, getByText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('btn-voltar'));
    fireEvent.press(getByText('Sair sem salvar'));
    
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});