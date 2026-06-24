import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useHomeViewModel } from './HomeViewModel';
import { useNavigation } from '@react-navigation/native';
import { partiesMock } from '../../mocks/partiesMock';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
  };
});

jest.mock('../../mocks/partiesMock', () => ({
  partiesMock: [
    { id: '1', name: 'Festa A', status: 'aguardando_sorteio' },
    { id: '2', name: 'Festa B', status: 'sorteio_realizado' },
    { id: '4', name: 'Festa D', status: 'Status Invalido' },
  ]
}));

jest.mock('../../mocks/participantesMock', () => ({
  participantesMock: [
    { usuario: { id: 'mock-user-uuid-1', nome: 'Duda' } }
  ]
}));

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    usuarioAtual: { id: 'mock-user-uuid-1', nome: 'Duda' },
  })),
}));

jest.mock('../../services/cloud/Party/PartyDb', () => ({
  getPartiesByUserId: jest.fn(() => Promise.resolve([
    { id: '1', name: 'Festa A', status: 'aguardando_sorteio' },
    { id: '2', name: 'Festa B', status: 'sorteio_realizado' },
    { id: '4', name: 'Festa D', status: 'Status Invalido' },
  ]))
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

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('deve retornar os dados iniciais corretamente (parties e userName)', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel());

    expect(result.current.userName).toBe('Duda');
    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });
    unmount();
  });

  it('deve navegar para CreateParty ao chamar handleCreateParty', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel());

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
    const { result, unmount } = renderHook(() => useHomeViewModel());

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
    const { result, unmount } = renderHook(() => useHomeViewModel());

    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });
    const party = partiesMock[0];

    act(() => {
      result.current.handleCardPress(party);
    });

    expect(mockNavigate).toHaveBeenCalledWith('ParticipantLobby', {
      partyId: party.id,
    });
    unmount();
  });

  it('deve navegar para PerfilSorteado quando status for "sorteio_realizado"', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel());

    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });
    const party = partiesMock[1];

    await result.current.handleCardPress(party);

    expect(mockNavigate).toHaveBeenCalledWith('PerfilSorteado', { 
      idPerfil: 'profile-id-1' 
    });
    unmount();
  });

  it('não deve navegar se o status for desconhecido (default)', async () => {
    const { result, unmount } = renderHook(() => useHomeViewModel());

    await waitFor(() => {
      expect(result.current.parties).toEqual(partiesMock);
    });
    const party = partiesMock[2];

    act(() => {
      result.current.handleCardPress(party);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    unmount();
  });
});