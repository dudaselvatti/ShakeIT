import { renderHook, act } from '@testing-library/react-native';
import { useHomeViewModel } from './HomeViewModel';
import { useNavigation } from '@react-navigation/native';
import { gerarPartyCode } from '../../utils/PartyCode/gerarPartyCode';
import { partiesMock } from '../../mocks/partiesMock';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
  };
});
jest.mock('../../utils/PartyCode/gerarPartyCode');
jest.mock('../../mocks/partiesMock', () => ({
  partiesMock: [
    { id: '1', name: 'Festa A', status: 'Aguardando Sorteio' },
    { id: '2', name: 'Festa B', status: 'Sorteio Realizado' },
    { id: '3', name: 'Festa C', status: 'Fim do evento' },
    { id: '4', name: 'Festa D', status: 'Status Invalido' },
  ]
}));

describe('useHomeViewModel', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (gerarPartyCode as jest.Mock).mockReturnValue('ABC-123');
  });

  it('deve retornar os dados iniciais corretamente (parties e userName)', () => {
    const { result } = renderHook(() => useHomeViewModel());

    expect(result.current.userName).toBe('Duda');
    expect(result.current.parties).toEqual(partiesMock);
  });

  it('deve navegar para CreateParty ao chamar handleCreateParty', () => {
    const { result } = renderHook(() => useHomeViewModel());

    act(() => {
      result.current.handleCreateParty();
    });

    expect(mockNavigate).toHaveBeenCalledWith('CreateParty');
  });

  it('deve gerar código e navegar para PartyAdmin quando status for "Aguardando Sorteio"', () => {
    const { result } = renderHook(() => useHomeViewModel());
    const party = partiesMock[0];

    act(() => {
      result.current.handleCardPress(party);
    });

    expect(gerarPartyCode).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('PartyAdmin', {
      partyName: party.name,
      partyCode: 'ABC-123',
    });
  });

  it('deve navegar para PerfilSorteado quando status for "Sorteio Realizado"', () => {
    const { result } = renderHook(() => useHomeViewModel());
    const party = partiesMock[1];

    act(() => {
      result.current.handleCardPress(party);
    });

    expect(mockNavigate).toHaveBeenCalledWith('PerfilSorteado', { idUsuario: 10 });
  });

  it('deve navegar para PerfilSorteado quando status for "Fim do evento"', () => {
    const { result } = renderHook(() => useHomeViewModel());
    const party = partiesMock[2];

    act(() => {
      result.current.handleCardPress(party);
    });

    expect(mockNavigate).toHaveBeenCalledWith('PerfilSorteado', { idUsuario: 10 });
  });

  it('não deve navegar se o status for desconhecido (default)', () => {
    const { result } = renderHook(() => useHomeViewModel());
    const party = partiesMock[3];

    act(() => {
      result.current.handleCardPress(party);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});