import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ScanScreen } from './index';

let mockPermission: any = null;
const mockRequestPermission = jest.fn();

jest.mock('expo-camera', () => {
  const { View } = require('react-native');
  return {
    useCameraPermissions: () => [mockPermission, mockRequestPermission],
    CameraView: (props: any) => <View testID="camera-view" {...props} />
  };
});

// Mock do AppHeader para isolar o teste
jest.mock('../../components/AppHeader', () => ({
  AppHeader: ({ headerTitle }: any) => {
    const { Text } = require('react-native');
    return <Text testID="app-header">{headerTitle}</Text>;
  }
}));

describe('Tela Scan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar apenas o AppHeader enquanto a permissão é nula (carregando)', () => {
    mockPermission = null;
    const { getByTestId, queryByTestId, queryByText } = render(
      <ScanScreen navigation={{}} />
    );

    expect(getByTestId('app-header')).toBeTruthy();
    expect(queryByTestId('camera-view')).toBeNull();
    expect(queryByText('Acesso à Câmera Necessário')).toBeNull();
  });

  it('deve solicitar a permissão no mount se ainda não foi concedida e pode perguntar', () => {
    mockPermission = { granted: false, canAskAgain: true, status: 'undetermined' };
    render(<ScanScreen navigation={{}} />);

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('deve exibir a tela de fallback de Acesso Negado caso a permissão seja negada e permitir clicar no botão', () => {
    mockPermission = { granted: false, canAskAgain: false, status: 'denied' };
    const { getByText, queryByTestId } = render(
      <ScanScreen navigation={{}} />
    );

    // Camera não deve renderizar
    expect(queryByTestId('camera-view')).toBeNull();

    // Textos do fallback devem aparecer
    expect(getByText('Acesso à Câmera Necessário')).toBeTruthy();
    expect(getByText('Precisamos do acesso à câmera para ler o QR Code da Party.')).toBeTruthy();

    // Botão de permitir
    const btnPermitir = getByText('Permitir Câmera');
    expect(btnPermitir).toBeTruthy();

    // Interagir com o botão deve chamar a requestPermission
    fireEvent.press(btnPermitir);
    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar a CameraView caso a permissão seja concedida', () => {
    mockPermission = { granted: true, canAskAgain: true, status: 'granted' };
    const { getByTestId, getByText, queryByText } = render(
      <ScanScreen navigation={{}} />
    );

    // A câmera deve renderizar
    expect(getByTestId('camera-view')).toBeTruthy();

    // A máscara (overlay com as instruções) deve renderizar
    expect(getByText('Aponte a câmera para o QR Code para entrar na Party')).toBeTruthy();

    // Não deve mostrar textos de permissão negada
    expect(queryByText('Acesso à Câmera Necessário')).toBeNull();
  });
});
