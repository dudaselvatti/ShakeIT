import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { CreatePartyScreen } from './index';
import { createPartyInCloud } from '../../services/cloudDb/cloudDb';
import { useAuth } from '../../contexts/AuthContext/AuthContext';

jest.mock('../../services/cloudDb/cloudDb', () => ({
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
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      usuarioAtual: {
        id: 2,
        nome: 'Usuário Teste',
      },
    });
  });
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

  it('não deve criar party se usuarioAtual for null', async () => {
    mockUseAuth.mockReturnValue({
      usuarioAtual: null,
    });

    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { getByText, getByPlaceholderText, getByTestId } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(
      getByPlaceholderText('Ex: Amigo Secreto da Firma'),
      'Natal 2026'
    );

    fireEvent.press(getByTestId('btn-selecionar-data'));

    fireEvent.changeText(getByPlaceholderText('0,00'), '1000');

    fireEvent.changeText(getByPlaceholderText('50,00'), '5000');

    fireEvent.press(getByText('Criar Party'));

    await waitFor(() => {
      expect(createPartyInCloud).not.toHaveBeenCalled();

      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  it('deve voltar à tela anterior ao confirmar a saída no modal', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Amigo Secreto da Firma'), 'Mudança');
    fireEvent.press(getByTestId('btn-chevron-left'));
    fireEvent.press(getByText('Sair sem salvar'));
    
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('deve navegar silenciosamente se não houver alterações', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByTestId } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId('btn-chevron-left'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('deve interceptar navegação do footer e exibir modal se houver alterações', () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
    // Mudar mock do AppFooter para este teste específico
    const { AppFooter } = require('../../components/AppFooter');
    const { getByPlaceholderText, getByText } = render(
      <CreatePartyScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Ex: Amigo Secreto da Firma'), 'Mudança');
    
    // Disparar o onNavigateIntercept
    const calls = require('../../components/AppFooter').AppFooter.mock.calls;
    const testProps = calls[calls.length - 1][0];
    act(() => {
      testProps.onNavigateIntercept('Home');
    });

    // Confirmar saída
    fireEvent.press(getByText('Sair sem salvar'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  });
});