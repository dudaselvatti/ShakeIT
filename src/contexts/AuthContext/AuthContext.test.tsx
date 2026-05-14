import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { View, Text } from "react-native";
import { AuthProvider, useAuth } from './AuthContext';
import { usuariosMock } from '../../mocks/usuariosMock';
import { seedUsuarios, getUsuariosFromCloud } from '../../services/cloudDb/cloudDb';

jest.mock('../../services/cloudDb/cloudDb', () => ({
  seedUsuarios: jest.fn(),
  getUsuariosFromCloud: jest.fn(),
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => 'mock-collection'),
  doc: jest.fn(() => 'mock-doc'),
  getDocs: jest.fn(() =>
    Promise.resolve({
      empty: true,
      docs: [],
    })
  ),
  setDoc: jest.fn(() => Promise.resolve()),
  addDoc: jest.fn(() =>
    Promise.resolve({
      id: 'mock-party-id',
    })
  ),
  updateDoc: jest.fn(() => Promise.resolve()),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

const mockedSeedUsuarios = seedUsuarios as jest.Mock;
const mockedGetUsuariosFromCloud = getUsuariosFromCloud as jest.Mock;

const TestComponent = () => {
  const { usuarioAtual, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text testID="usuario">
        {usuarioAtual ? usuarioAtual.nome : 'Nenhum usuário'}
      </Text>
    </View>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar carregando', () => {
    mockedSeedUsuarios.mockReturnValue(new Promise(() => {}));
    mockedGetUsuariosFromCloud.mockReturnValue(new Promise(() => {}));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('deve chamar seedUsuarios e getUsuariosFromCloud ao inicializar', async () => {
    mockedSeedUsuarios.mockResolvedValue(undefined);
    mockedGetUsuariosFromCloud.mockResolvedValue(usuariosMock);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockedSeedUsuarios).toHaveBeenCalledTimes(1);
      expect(mockedGetUsuariosFromCloud).toHaveBeenCalledTimes(1);
    });
  });

  it('deve definir um usuário diferente do admin vindo do banco de dados', async () => {
    mockedSeedUsuarios.mockResolvedValue(undefined);
    
    mockedGetUsuariosFromCloud.mockResolvedValue(usuariosMock);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      const usuarioRenderizado = screen.getByTestId('usuario').props.children;

      const usuariosSemAdmin = usuariosMock.filter(u => String(u.id) !== '1');
      const nomesPermitidos = usuariosSemAdmin.map(u => u.nome);

      expect(nomesPermitidos).toContain(usuarioRenderizado);
    });
  });

  it('deve finalizar loading mesmo em caso de erro', async () => {
    mockedSeedUsuarios.mockResolvedValue(undefined);
    mockedGetUsuariosFromCloud.mockRejectedValue(new Error('Erro ao buscar do Firestore'));

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});