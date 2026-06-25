import { renderHook, waitFor } from '@testing-library/react-native';
import { usePerfilSorteadoViewModel } from './PerfilSorteadoViewModel';
import { useRoute } from '@react-navigation/native';
import { getPartyFromCloud, updateParty } from '../../services/cloud/Party/PartyDb';
import { getParticipantsByPartyId } from '../../services/cloud/PartyParticipant/PartyParticipantDb';
import { getDrawResultByGiverProfileId, getAllDrawResultsByPartyId } from '../../services/cloud/DrawResult/DrawResultDb';
import { useAuth } from '../../contexts/AuthContext/AuthContext';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../services/cloud/Party/PartyDb', () => ({
  getPartyFromCloud: jest.fn(),
  updateParty: jest.fn(),
  listenToParty: jest.fn((partyId, callback) => {
    return () => {};
  }),
}));

jest.mock('../../services/cloud/Notification/NotificationDb', () => ({
  createNotification: jest.fn(),
}));

jest.mock('../../services/cloud/PartyParticipant/PartyParticipantDb', () => ({
  getParticipantsByPartyId: jest.fn(),
}));

jest.mock('../../services/cloud/DrawResult/DrawResultDb', () => ({
  getDrawResultByGiverProfileId: jest.fn(),
  getAllDrawResultsByPartyId: jest.fn(),
}));

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ViewModel: usePerfilSorteadoViewModel', () => {
  const mockedUseRoute = useRoute as jest.Mock;
  const mockedGetPartyFromCloud = getPartyFromCloud as jest.Mock;
  const mockedGetParticipantsByPartyId = getParticipantsByPartyId as jest.Mock;
  const mockedUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve carregar as abas corretamente e finalizar o loading', async () => {
    mockedUseRoute.mockReturnValue({ params: { partyId: 'party-1' } });
    mockedUseAuth.mockReturnValue({ usuarioAtual: { id: 'user-1' } });
    
    mockedGetPartyFromCloud.mockResolvedValue({ id: 'party-1', name: 'Festa Mock' });
    mockedGetParticipantsByPartyId.mockResolvedValue([
      { perfil: { id: 'prof-1', user_id: 'user-1', status: 'confirmado' } }
    ]);

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.tabs.length).toBeGreaterThan(0);
    });
  });

  it('deve ordenar as abas corretamente (Eu, Alfabética, Evento)', async () => {
    mockedUseRoute.mockReturnValue({ params: { partyId: 'party-1' } });
    mockedUseAuth.mockReturnValue({ usuarioAtual: { id: 'user-1' } });
    mockedGetPartyFromCloud.mockResolvedValue({ id: 'party-1', name: 'Festa Mock', status: 'sorteio_realizado' });
    
    mockedGetParticipantsByPartyId.mockResolvedValue([
      { perfil: { id: 'prof-eu', user_id: 'user-1', status: 'confirmado', participant_type: 'user', participant_name: 'Ana' } },
      { perfil: { id: 'prof-depB', user_id: 'user-1', status: 'confirmado', participant_type: 'dependent', participant_name: 'Zebra' } },
      { perfil: { id: 'prof-depA', user_id: 'user-1', status: 'confirmado', participant_type: 'dependent', participant_name: 'Bolinha' } },
      { perfil: { id: 'prof-receiver-eu', user_id: 'other', status: 'confirmado' } },
      { perfil: { id: 'prof-receiver-b', user_id: 'other', status: 'confirmado' } },
      { perfil: { id: 'prof-receiver-a', user_id: 'other', status: 'confirmado' } }
    ]);

    const mockGetDrawResultByGiverProfileId = require('../../services/cloud/DrawResult/DrawResultDb').getDrawResultByGiverProfileId;
    mockGetDrawResultByGiverProfileId.mockImplementation((partyId: string, giverId: string) => {
        if (giverId === 'prof-eu') return Promise.resolve({ receiver_profile_id: 'prof-receiver-eu' });
        if (giverId === 'prof-depB') return Promise.resolve({ receiver_profile_id: 'prof-receiver-b' });
        if (giverId === 'prof-depA') return Promise.resolve({ receiver_profile_id: 'prof-receiver-a' });
        return Promise.resolve(null);
    });

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const tabs = result.current.tabs;
    expect(tabs.length).toBe(4);
    expect(tabs[0].label).toBe("Eu");
    expect(tabs[1].label).toBe("Bolinha"); // Ordem alfabética
    expect(tabs[2].label).toBe("Zebra");
    expect(tabs[3].label).toBe("Evento"); // Evento por último
  });

  it('deve retornar falso em handleRevealAll se o dia do evento for hoje ou no futuro', async () => {
    mockedUseRoute.mockReturnValue({ params: { partyId: 'party-1' } });
    mockedUseAuth.mockReturnValue({ usuarioAtual: { id: 'user-1' } });
    
    // Configura a data para daqui a 10 dias
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateString = futureDate.toISOString().split('T')[0];

    mockedGetPartyFromCloud.mockResolvedValue({ id: 'party-1', name: 'Festa Mock', event_date: dateString });
    mockedGetParticipantsByPartyId.mockResolvedValue([]);

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.handleRevealAll()).toBe(false);
  });

  it('deve retornar verdadeiro em handleRevealAll se a data do evento já passou', async () => {
    mockedUseRoute.mockReturnValue({ params: { partyId: 'party-1' } });
    mockedUseAuth.mockReturnValue({ usuarioAtual: { id: 'user-1' } });
    
    // Configura a data para 10 dias atrás
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    const dateString = pastDate.toISOString().split('T')[0];

    mockedGetPartyFromCloud.mockResolvedValue({ id: 'party-1', name: 'Festa Mock', event_date: dateString });
    mockedGetParticipantsByPartyId.mockResolvedValue([]);

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.handleRevealAll()).toBe(true);
  });

  it('deve chamar updateParty e disparar notificacoes em confirmRevealAll', async () => {
    mockedUseRoute.mockReturnValue({ params: { partyId: 'party-1' } });
    mockedUseAuth.mockReturnValue({ usuarioAtual: { id: 'user-1' } });
    
    mockedGetPartyFromCloud.mockResolvedValue({ id: 'party-1', name: 'Festa Mock', event_date: '2023-01-01' });
    mockedGetParticipantsByPartyId.mockResolvedValue([
      { perfil: { id: 'prof-1', user_id: 'user-1', status: 'confirmado' } },
      { perfil: { id: 'prof-2', user_id: 'user-2', status: 'confirmado' } }
    ]);
    const mockUpdateParty = require('../../services/cloud/Party/PartyDb').updateParty;
    const mockCreateNotification = require('../../services/cloud/Notification/NotificationDb').createNotification;
    mockUpdateParty.mockResolvedValue({});
    mockCreateNotification.mockResolvedValue('notif-id');

    const { result } = renderHook(() => usePerfilSorteadoViewModel());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await waitFor(async () => {
      await result.current.confirmRevealAll();
    });

    expect(mockUpdateParty).toHaveBeenCalledWith('party-1', { status: 'sorteio_revelado' });
    expect(mockCreateNotification).toHaveBeenCalledTimes(1);
    expect(mockCreateNotification).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'user-2', type: 'general' }));
  });
});