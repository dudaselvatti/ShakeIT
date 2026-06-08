import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { View, Text, Button } from "react-native";
import { AuthProvider, useAuth } from './AuthContext';
import { getUserById, userLogout } from '../../services/cloud/User/UserDb';
import { onAuthStateChanged } from 'firebase/auth';

jest.mock('../../services/cloud/User/UserDb', () => ({
  getUserById: jest.fn(),
  userLogout: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('../../config/firebase', () => ({
  auth: { mockAuthInstance: true },
}));

const mockedGetUserById = getUserById as jest.Mock;
const mockedUserLogout = userLogout as jest.Mock;
const mockedOnAuthStateChanged = onAuthStateChanged as jest.Mock;

const TestComponent = () => {
  const { usuarioAtual, isLoading, logoutContext } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text testID="usuario">
        {usuarioAtual ? usuarioAtual.nome : 'Nenhum usuário'}
      </Text>
      <Button title="Sair" onPress={logoutContext} testID="btn-logout" />
    </View>
  );
};

describe('AuthProvider', () => {
  let authCallback: (user: any) => void;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedOnAuthStateChanged.mockImplementation((authInstance, callback) => {
      authCallback = callback;
      return jest.fn();
    });
  });

  it('deve iniciar no estado de carregamento (isLoading = true)', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('deve carregar os dados do usuário com sucesso se autenticado no Firebase', async () => {
    const mockFirebaseUser = { uid: '123_abc' };
    const mockUserData = { id: '123_abc', nome: 'João Silva', email: 'joao@teste.com' };

    mockedGetUserById.mockResolvedValue(mockUserData);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    authCallback(mockFirebaseUser);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
      expect(screen.getByTestId('usuario').props.children).toBe('João Silva');
    });

    expect(mockedGetUserById).toHaveBeenCalledWith('123_abc');
  });

  it('deve definir usuarioAtual como null se não houver usuário autenticado no Firebase', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    authCallback(null);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
      expect(screen.getByTestId('usuario').props.children).toBe('Nenhum usuário');
    });
  });

  it('deve tratar o caso onde o usuário existe no Auth mas não no Firestore', async () => {
    const mockFirebaseUser = { uid: 'nao_existe_no_banco' };
    
    mockedGetUserById.mockResolvedValue(null);

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    authCallback(mockFirebaseUser);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
      expect(screen.getByTestId('usuario').props.children).toBe('Nenhum usuário');
    });

    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });

  it('deve finalizar o loading e definir usuário como null em caso de erro na requisição', async () => {
    const mockFirebaseUser = { uid: 'uid_com_erro' };
    mockedGetUserById.mockRejectedValue(new Error('Erro de conexão ao banco'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    authCallback(mockFirebaseUser);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
      expect(screen.getByTestId('usuario').props.children).toBe('Nenhum usuário');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('deve chamar a função userLogout do serviço ao executar o logoutContext', async () => {
    mockedUserLogout.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    authCallback(null);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    const botaoLogout = screen.getByTestId('btn-logout');
    fireEvent.press(botaoLogout);

    expect(mockedUserLogout).toHaveBeenCalledTimes(1);
  });
});