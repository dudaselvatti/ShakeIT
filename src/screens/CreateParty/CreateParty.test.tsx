import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { CreatePartyScreen } from './index';
import { createPartyInCloud } from '../../services/cloud/Party/PartyDb';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { AppFooter } from '../../components/AppFooter';

jest.mock('../../services/cloud/Party/PartyDb', () => ({
  createPartyInCloud: jest.fn(),
}));

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
  useAuth: jest.fn(),
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
  AppFooter: jest.fn(() => null),
}));

const mockAppFooter = AppFooter as unknown as jest.Mock;

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
  const MockIconButton = ({ onPress, iconName }: any) => (
    <TouchableOpacity testID={`btn-${iconName}`} onPress={onPress} />
  );
  MockIconButton.displayName = 'MockIconButton';
  return { IconButton: MockIconButton };
});

const mockUseAuth = useAuth as jest.Mock;
const mockCreatePartyInCloud = createPartyInCloud as jest.Mock;

const mockPartyResponse = {
  id: 'mockPartyId',
  name: 'Natal 2026',
  minPrice: 10,
  maxPrice: 50,
  idAdmin: 1,
  inviteCode: '#XYZ123',
  eventDate: '2026-12-25T00:00:00.000Z',
  status: 'Aguardando Sorteio',
};

describe('Tela CreateParty', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      usuarioAtual: {
        id: 2,
        nome: 'Usuário Teste',
      },
    });

    mockCreatePartyInCloud.mockResolvedValue(mockPartyResponse);
  });

  it('deve validar os campos vazios, exibir erros vermelhos e não navegar', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), addListener: jest.fn(() => jest.fn()), dispatch: jest.fn() };
    const { getByText, getByPlaceholderText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Amigo Secreto da Firma'), 'Natal 2026');

    await act(async () => {
      fireEvent.press(getByText('Criar Party'));
    });

    expect(getByText('Selecione a data da revelação.')).toBeTruthy();
    expect(getByText('Preencha o valor mínimo e máximo.')).toBeTruthy();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('deve instanciar o objeto Party e navegar com sucesso se tudo estiver correto', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), addListener: jest.fn(() => jest.fn()), dispatch: jest.fn() };
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Amigo Secreto da Firma'), 'Natal 2026');
    fireEvent.press(getByTestId('btn-selecionar-data'));
    fireEvent.changeText(getByPlaceholderText('0,00'), '10,00'); 
    fireEvent.changeText(getByPlaceholderText('50,00'), '50,00');

    await act(async () => {
      fireEvent.press(getByText('Criar Party'));
    });

    expect(mockCreatePartyInCloud).toHaveBeenCalledWith({
      name: 'Natal 2026',
      event_date: '2026-12-25T00:00:00.000Z',
      min_value: 10,
      max_value: 50,
      admin_id: 2, // ID vindo do mock do useAuth
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PartyCreated', {
      party: mockPartyResponse,
    });
  });

  it('não deve criar party se usuarioAtual for null', async () => {
    mockUseAuth.mockReturnValue({
      usuarioAtual: null,
    });

    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), addListener: jest.fn(() => jest.fn()), dispatch: jest.fn() };
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Amigo Secreto da Firma'), 'Natal 2026');
    fireEvent.press(getByTestId('btn-selecionar-data'));
    fireEvent.changeText(getByPlaceholderText('0,00'), '10,00');
    fireEvent.changeText(getByPlaceholderText('50,00'), '50,00');

    await act(async () => {
      fireEvent.press(getByText('Criar Party'));
    });

    expect(mockCreatePartyInCloud).not.toHaveBeenCalled();
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('deve voltar à tela anterior ao confirmar a saída no modal', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), addListener: jest.fn(() => jest.fn()), dispatch: jest.fn() };
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Amigo Secreto da Firma'), 'Mudança');
    fireEvent.press(getByTestId('btn-chevron-left'));
    
    await act(async () => {
      fireEvent.press(getByText('Sair sem salvar'));
    });
    
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('deve navegar silenciosamente se não houver alterações', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), addListener: jest.fn(() => jest.fn()), dispatch: jest.fn() };
    const { getByTestId } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('btn-chevron-left'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('deve interceptar navegação do footer e exibir modal se houver alterações', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), addListener: jest.fn(() => jest.fn()), dispatch: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Amigo Secreto da Firma'), 'Mudança');
    
    const calls = mockAppFooter.mock.calls;
    const testProps = calls[calls.length - 1][0];
    
    act(() => {
      testProps.onNavigateIntercept('Home');
    });

    await act(async () => {
      fireEvent.press(getByText('Sair sem salvar'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  });
});