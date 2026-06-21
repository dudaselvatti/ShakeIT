import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePartyAdminViewModel } from './PartyAdminViewModel';
import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";
import { getPartyFromCloud } from '../../services/cloud/Party/PartyDb';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  };
});

jest.mock('../../services/cloud/Party/PartyDb', () => ({
  getPartyFromCloud: jest.fn(),
}));

jest.mock('../../mocks/participantesMock', () => ({
  participantesMock: [
    { usuario: { id: '550e8400-e29b-41d4-a716-446655440001', nome: 'User 1' }, perfil: { status: 'confirmado' } },
    { usuario: { id: '550e8400-e29b-41d4-a716-446655440002', nome: 'User 2' }, perfil: { status: 'confirmado' } },
    { usuario: { id: '550e8400-e29b-41d4-a716-446655440003', nome: 'User 3' }, perfil: { status: 'pendente' } },
  ]
}));

const mockGetPartyFromCloud = getPartyFromCloud as jest.Mock;

describe('usePartyAdminViewModel', () => {
  const mockNavigate = jest.fn();
  const mockRouteParams = {
    params: {
      partyId: 'mock-party-123',
    },
  };

  const mockPartyResponse = {
    id: 'mock-party-123',
    name: 'Festa do Firestore',
    invite_code: 'XYZ123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useRoute as jest.Mock).mockReturnValue(mockRouteParams);
    
    mockGetPartyFromCloud.mockResolvedValue(mockPartyResponse);
  });

  it('deve buscar e expor corretamente os dados da party obtidos do Firestore', async () => {
    const { result } = renderHook(() => usePartyAdminViewModel());

    expect(result.current.partyName).toBe('Carregando...');
    expect(result.current.partyCode).toBe('...');

    await waitFor(() => {
      expect(mockGetPartyFromCloud).toHaveBeenCalledWith('mock-party-123');
      expect(result.current.partyName).toBe('Festa do Firestore');
      expect(result.current.partyCode).toBe('XYZ123');
    });
  });

  it('deve manter o fallback de carregamento se o banco retornar null', async () => {
    mockGetPartyFromCloud.mockResolvedValue(null);
    const { result } = renderHook(() => usePartyAdminViewModel());

    await waitFor(() => {
      expect(result.current.partyName).toBe('Carregando...');
      expect(result.current.partyCode).toBe('...');
    });
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

  it('deve navegar para a tela "PartyDrawRestrictions" enviando o partyId', () => {
    const { result } = renderHook(() => usePartyAdminViewModel());

    act(() => {
      result.current.handleNavigatePartyDrawRestrictions();
    });

    expect(mockNavigate).toHaveBeenCalledWith('PartyDrawRestrictions', { 
      partyId: 'mock-party-123' 
    });
  });

  it('deve navegar para a tela "ShakeReveal" ao chamar handleSorteioPress', () => {
    const { result } = renderHook(() => usePartyAdminViewModel());

    act(() => {
      result.current.handleSorteioPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('ShakeReveal');
  });
});