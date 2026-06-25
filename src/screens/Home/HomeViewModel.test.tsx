import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useHomeViewModel } from './HomeViewModel';
import { useNavigation } from '@react-navigation/native';
import { partiesMock } from '../../mocks/partiesMock';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
  };
});

jest.mock('../../mocks/partiesMock', () => ({
  partiesMock: [
    { id: '1', admin_id: 'mock-user-uuid-1', name: 'Festa A', status: 'aguardando_sorteio', event_date: '2024-12-01', adminName: 'Você' },
    { id: '4', admin_id: 'mock-user-uuid-1', name: 'Festa D', status: 'Status Invalido', event_date: '2024-12-03', adminName: 'Você' },
    { id: '2', admin_id: 'outra-pessoa', name: 'Festa B', status: 'sorteio_realizado', event_date: '2024-12-02', adminName: 'João' },
  ]
}));

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    usuarioAtual: { id: 'mock-user-uuid-1', nome: 'Duda' },
  })),
}));

jest.mock('../../services/cloud/Party/PartyDb', () => ({
  getPartiesByUserId: jest.fn(() => Promise.resolve([
    { id: '1', admin_id: 'mock-user-uuid-1', name: 'Festa A', status: 'aguardando_sorteio', event_date: '2024-12-01' },
    { id: '2', admin_id: 'outra-pessoa', name: 'Festa B', status: 'sorteio_realizado', event_date: '2024-12-02' },
    { id: '4', admin_id: 'mock-user-uuid-1', name: 'Festa D', status: 'Status Invalido', event_date: '2024-12-03' },
  ]))
}));

jest.mock('../../services/cloud/User/UserDb', () => ({
  getUserById: jest.fn(() => Promise.resolve({ nome: 'João' }))
}));

jest.mock('../../services/cloud/PartyParticipant/PartyParticipantDb', () => ({
  getPartyParticipantByUserIdAndPartyId: jest.fn(() => Promise.resolve({
    perfil: { id: 'profile-id-1', participant_name: 'Duda' },
    has_revealed_draw: true
  }))
}));

jest.mock('../../services/cloud/DrawResult/DrawResultDb', () => ({
  getDrawResultByGiverProfileId: jest.fn(() => Promise.resolve({
    receiver_profile_id: 'profile-id-1'
  }))
}));

describe('useHomeViewModel', () => {
  const mockNavigate = jest.fn();
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('deve retornar os dados iniciais corretamente (parties e userName)', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel(), { wrapper });

    expect(result.current.userName).toBe('Duda');
    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });
    unmount();
  });

  it('deve navegar para CreateParty ao chamar handleCreateParty', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel(), { wrapper });

    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });

    act(() => {
      result.current.handleCreateParty();
    });

    expect(mockNavigate).toHaveBeenCalledWith('CreateParty');
    unmount();
  });

  it('deve navegar para Scan ao chamar handleScanPress', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel(), { wrapper });

    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });

    act(() => {
      result.current.handleScanPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('Scan');
    unmount();
  });

  it('deve navegar para PartyAdmin enviando o partyId quando status for "aguardando_sorteio"', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel(), { wrapper });

    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });
    const party = partiesMock[0];

    act(() => {
      result.current.handleCardPress(party);
    });

    expect(mockNavigate).toHaveBeenCalledWith('PartyAdmin', {
      partyId: party.id,
    });
    unmount();
  });

  it('deve navegar para PerfilSorteado quando status for "sorteio_realizado"', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel(), { wrapper });

    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });
    const party = partiesMock[2];

    await result.current.handleCardPress(party);

    expect(mockNavigate).toHaveBeenCalledWith('PerfilSorteado', { 
      partyId: party.id 
    });
    unmount();
  });

  it('não deve navegar se o status for desconhecido (default)', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel(), { wrapper });

    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });
    const party = partiesMock[1];

    act(() => {
      result.current.handleCardPress(party);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    unmount();
  });
});
