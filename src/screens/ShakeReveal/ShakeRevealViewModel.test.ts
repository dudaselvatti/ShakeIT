import { renderHook, waitFor } from '@testing-library/react-native';
import { usePerfilSorteadoViewModel } from '../PerfilSorteado/PerfilSorteadoViewModel';
import { useRoute } from '@react-navigation/native';
import { participantesMock } from '../../mocks/participantesMock';
import { getAmigoSecreto } from '../../services/cloud/Participant/PartcicipantDb';
import { storageService } from '../../services/storageService';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../services/cloud/Participant/PartcicipantDb', () => ({
  getAmigoSecreto: jest.fn(),
}));

jest.mock('../../services/storageService', () => ({
  storageService: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
  }
}));

describe('usePerfilSorteadoViewModel', () => {
  const mockedUseRoute = useRoute as jest.Mock;
  const mockedGetAmigoSecreto = getAmigoSecreto as jest.Mock;
  const mockedStorageService = storageService as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o participante correto baseado no idUsuario da rota', async () => {
    const mockId = participantesMock[0].usuario.id;
    mockedUseRoute.mockReturnValue({
      params: { idUsuario: mockId },
    });
    mockedGetAmigoSecreto.mockResolvedValue(participantesMock[0]);

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.participante).toEqual(participantesMock[0]);
    });

    expect(mockedStorageService.setItem).toHaveBeenCalledWith(`amigo_secreto_${mockId}`, participantesMock[0]);
  });

  it('deve recuperar do cache quando a requisicao online falhar', async () => {
    const mockId = participantesMock[0].usuario.id;
    mockedUseRoute.mockReturnValue({
      params: { idUsuario: mockId },
    });
    mockedGetAmigoSecreto.mockRejectedValue(new Error('Erro de rede'));
    mockedStorageService.getItem.mockResolvedValue(participantesMock[0]);

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.participante).toEqual(participantesMock[0]);
    });

    expect(mockedStorageService.getItem).toHaveBeenCalledWith(`amigo_secreto_${mockId}`);
  });

  it('deve registrar erro no console caso participante nao seja encontrado e sem cache', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedUseRoute.mockReturnValue({
      params: { idUsuario: 'invalid-id' },
    });
    mockedGetAmigoSecreto.mockRejectedValue(new Error('Nao encontrado'));
    mockedStorageService.getItem.mockResolvedValue(null);

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.participante).toBeNull();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});