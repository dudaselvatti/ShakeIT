import { renderHook, act } from '@testing-library/react-native';
import { useImagePickerViewModel, Props } from './ImagePickerViewModel';
import * as ImagePicker from 'expo-image-picker';

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

describe('useImagePickerViewModel', () => {
  const mockOnChangeImage = jest.fn();
  const defaultProps: Props = {
    label: 'Foto de Perfil',
    value: 'uri-inicial.jpg',
    onChangeImage: mockOnChangeImage,
    containerStyle: { marginTop: 10 },
  };

  const originalAlert = global.alert;
  beforeAll(() => {
    global.alert = jest.fn();
  });

  afterAll(() => {
    global.alert = originalAlert;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os valores iniciais passados por propriedade corretamente', () => {
    const { result } = renderHook(() => useImagePickerViewModel(defaultProps));

    expect(result.current.label).toBe(defaultProps.label);
    expect(result.current.value).toBe(defaultProps.value);
    expect(result.current.containerStyle).toEqual(defaultProps.containerStyle);
    expect(typeof result.current.handlePickImage).toBe('function');
  });

  it('deve exibir um alerta se a permissão da galeria for negada', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });

    const { result } = renderHook(() => useImagePickerViewModel(defaultProps));

    await act(async () => {
      await result.current.handlePickImage();
    });

    expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledWith("Permissão para acessar a galeria é necessária!");
    expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
    expect(mockOnChangeImage).not.toHaveBeenCalled();
  });

  it('deve chamar onChangeImage com a URI correta quando a imagem for selecionada com sucesso', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });

    const mockUri = 'file://caminho/da/nova-imagem.jpg';
    const mockBase64 = 'abcde12345';
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: mockUri, base64: mockBase64 }],
    });

    const { result } = renderHook(() => useImagePickerViewModel(defaultProps));

    await act(async () => {
      await result.current.handlePickImage();
    });

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1, // Compressão pesada para salvar no banco
      base64: true, // Adicionado para retornar a string em base64
    });

    expect(mockOnChangeImage).toHaveBeenCalledWith(`data:image/jpeg;base64,${mockBase64}`);
    expect(global.alert).not.toHaveBeenCalled();
  });

  it('não deve chamar onChangeImage se o usuário cancelar a seleção da imagem', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: true,
    });

    const { result } = renderHook(() => useImagePickerViewModel(defaultProps));

    await act(async () => {
      await result.current.handlePickImage();
    });

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    expect(mockOnChangeImage).not.toHaveBeenCalled();
  });
});