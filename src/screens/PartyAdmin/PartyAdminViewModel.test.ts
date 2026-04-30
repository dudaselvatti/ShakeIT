import { renderHook, act } from '@testing-library/react-native';
import { usePartyAdminViewModel } from './PartyAdminViewModel';
import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  };
});

jest.mock('../../mocks/participantesMock', () => ({
  participantesMock: [
    { usuario: { id: 1, nome: 'User 1' }, perfil: { isConfirmado: true } },
    { usuario: { id: 2, nome: 'User 2' }, perfil: { isConfirmado: true } },
    { usuario: { id: 3, nome: 'User 3' }, perfil: { isConfirmado: false } },
  ]
}));

describe('usePartyAdminViewModel', () => {
  const mockNavigate = jest.fn();
  const mockRouteParams = {
    params: {
      partyName: 'Festa de Teste',
      partyCode: 'XYZ123',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useRoute as jest.Mock).mockReturnValue(mockRouteParams);
  });

  it('deve extrair corretamente os parâmetros da rota', () => {
    const { result } = renderHook(() => usePartyAdminViewModel());

    expect(result.current.partyName).toBe('Festa de Teste');
    expect(result.current.partyCode).toBe('XYZ123');
  });

  it('deve retornar o título fixo do header', () => {
    const { result } = renderHook(() => usePartyAdminViewModel());
    expect(result.current.headerTitle).toBe('Painel do Evento');
  });

  it('deve calcular corretamente o número de participantes confirmados e o total', () => {
    const { result } = renderHook(() => usePartyAdminViewModel());

    expect(result.current.confirmadosCount).toBe(2);
    expect(result.current.participantesTotal).toBe(3);
    expect(result.current.participantes).toEqual(participantesMock);
  });

  it('deve navegar para a tela "ShakeReveal" ao chamar handleSorteioPress', () => {
    const { result } = renderHook(() => usePartyAdminViewModel());

    act(() => {
      result.current.handleSorteioPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('ShakeReveal');
  });
});