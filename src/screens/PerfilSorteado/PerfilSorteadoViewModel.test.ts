import { renderHook } from '@testing-library/react-native';
import { usePerfilSorteadoViewModel } from './PerfilSorteadoViewModel';
import { useRoute } from '@react-navigation/native';
import { participantesMock } from '../../mocks/participantesMock';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

describe('ViewModel: usePerfilSorteadoViewModel', () => {
  const mockedUseRoute = useRoute as jest.Mock;

  it('deve retornar o participante correto baseado no idUsuario da rota', () => {
    const mockId = participantesMock[0].usuario.id;

    mockedUseRoute.mockReturnValue({
      params: { idUsuario: mockId },
    });

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    expect(result.current.participante).toEqual(participantesMock[0]);
    expect(result.current.isLoading).toBe(false);
  });

  it('deve encontrar o participante mesmo que o idUsuario seja passado como string', () => {
    const mockId = participantesMock[0].usuario.id;

    mockedUseRoute.mockReturnValue({
      params: { idUsuario: String(mockId) },
    });

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    expect(result.current.participante.usuario.id).toBe(mockId);
  });

  it('deve lançar um erro caso o participante não seja encontrado', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockedUseRoute.mockReturnValue({
      params: { idUsuario: 999999 },
    });

    expect(() => {
      renderHook(() => usePerfilSorteadoViewModel());
    }).toThrow("Participante não foi encontrado!");

    consoleSpy.mockRestore();
  });
});