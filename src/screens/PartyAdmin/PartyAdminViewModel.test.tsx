import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePartyAdminViewModel } from './PartyAdminViewModel';
import { useRoute, useNavigation } from '@react-navigation/native';
import { participantesMock } from "../../mocks/participantesMock";
import { getPartyFromCloud } from '../../services/cloud/Party/PartyDb';
import { Alert } from 'react-native';
import { executeDraw } from '../../services/cloud/DrawAlgorithm/DrawAlgorithm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  };
});

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
  useAuth: jest.fn(() => ({ usuarioAtual: { id: 'test-user-id' } })),
}));

jest.mock('../../services/cloud/Party/PartyDb', () => ({
  getPartyFromCloud: jest.fn(),
  listenToParty: jest.fn((partyId, callback) => {
    callback({
      id: 'mock-party-123',
      name: 'Festa do Firestore',
      invite_code: 'XYZ123',
    });
    return () => {};
  })
}));

jest.mock('../../services/cloud/PartyParticipant/PartyParticipantDb', () => ({
  getParticipantsByPartyId: jest.fn(),
  updatePartyParticipant: jest.fn(),
  listenToParticipantsByPartyId: jest.fn((partyId, callback) => {
    const { participantesMock } = require("../../mocks/participantesMock");
    callback(participantesMock);
    return () => {};
  })
}));

jest.mock('../../services/cloud/DrawAlgorithm/DrawAlgorithm', () => ({
  executeDraw: jest.fn(() => Promise.resolve({ success: true, message: 'Sucesso' })),
}));

jest.mock('../../mocks/participantesMock', () => ({
  participantesMock: [
    { usuario: { id: '550e8400-e29b-41d4-a716-446655440001', nome: 'User 1' }, perfil: { status: 'confirmado' } },
    { usuario: { id: '550e8400-e29b-41d4-a716-446655440002', nome: 'User 2' }, perfil: { status: 'confirmado' } },
    { usuario: { id: '550e8400-e29b-41d4-a716-446655440003', nome: 'User 3' }, perfil: { status: 'confirmado' } },
  ]
}));

import { getParticipantsByPartyId, listenToParticipantsByPartyId } from '../../services/cloud/PartyParticipant/PartyParticipantDb';
import { listenToParty } from '../../services/cloud/Party/PartyDb';

const mockGetPartyFromCloud = getPartyFromCloud as jest.Mock;
const mockGetParticipantsByPartyId = getParticipantsByPartyId as jest.Mock;
const mockListenToParty = listenToParty as jest.Mock;
const mockListenToParticipantsByPartyId = listenToParticipantsByPartyId as jest.Mock;

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

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useRoute as jest.Mock).mockReturnValue(mockRouteParams);
    
    mockGetPartyFromCloud.mockResolvedValue(mockPartyResponse);
    mockGetParticipantsByPartyId.mockResolvedValue(participantesMock);
    
    mockListenToParty.mockImplementation((partyId, callback) => {
      callback(mockPartyResponse);
      return () => {};
    });

    mockListenToParticipantsByPartyId.mockImplementation((partyId, callback) => {
      callback(participantesMock);
      return () => {};
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('deve buscar e expor corretamente os dados da party obtidos do Firestore via listener', async () => {
    const { result } = renderHook(() => usePartyAdminViewModel(), { wrapper });

    await waitFor(() => {
      expect(mockListenToParty).toHaveBeenCalled();
      expect(result.current.partyName).toBe('Festa do Firestore');
      expect(result.current.partyCode).toBe('XYZ123');
    });
  });

  it('deve manter o fallback de carregamento se o banco retornar null no listener', async () => {
    mockListenToParty.mockImplementation((partyId, callback) => {
      callback(null);
      return () => {};
    });
    
    const { result } = renderHook(() => usePartyAdminViewModel(), { wrapper });

    await waitFor(() => {
      expect(result.current.partyName).toBe('Carregando...');
      expect(result.current.partyCode).toBe('...');
    });
  });

  it('deve retornar o título fixo do header', () => {
    const { result } = renderHook(() => usePartyAdminViewModel(), { wrapper });
    expect(result.current.headerTitle).toBe('Painel do Evento');
  });

  it('deve calcular corretamente o número de participantes confirmados e o total', async () => {
    const { result } = renderHook(() => usePartyAdminViewModel(), { wrapper });

    await waitFor(() => {
        expect(result.current.confirmadosCount).toBe(3);
        expect(result.current.participantsTotal).toBe(3);
        expect(result.current.participants).toEqual(participantesMock);
    });
  });

  it('deve navegar para a tela "PartyDrawRestrictions" enviando o partyId', () => {
    const { result } = renderHook(() => usePartyAdminViewModel(), { wrapper });

    act(() => {
      result.current.handleNavigatePartyDrawRestrictions();
    });

    expect(mockNavigate).toHaveBeenCalledWith('PartyDrawRestrictions', { 
      partyId: 'mock-party-123' 
    });
  });

  it('deve navegar para a tela "ShakeReveal" ao chamar handleSorteioPress', async () => {
    const { result } = renderHook(() => usePartyAdminViewModel(), { wrapper });

    await waitFor(() => {
        expect(result.current.confirmadosCount).toBe(3);
    });

    await act(async () => {
      await result.current.handleSorteioPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('ShakeReveal', { partyId: 'mock-party-123' });
  });

  it('deve exibir um PopupModal customizado ao receber erro no sorteio', async () => {
    (executeDraw as jest.Mock).mockRejectedValueOnce(new Error('Qualquer erro'));

    const { result } = renderHook(() => usePartyAdminViewModel(), { wrapper });

    await waitFor(() => {
        expect(result.current.confirmadosCount).toBe(3);
    });

    await act(async () => {
      await result.current.handleSorteioPress();
    });

    expect(result.current.errorModalVisible).toBe(true);
    expect(result.current.errorModalTitle).toBe("Impossível realizar o sorteio!");
    expect(result.current.errorModalMessage).toContain("As regras de restrições cadastradas impedem de realizar o sorteio. Ajuste elas e tente novamente.");
  });
});