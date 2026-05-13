import { usePartyCreatedViewModel } from './PartyCreatedViewModel';
import { useRoute, useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

describe('usePartyCreatedViewModel', () => {
  const mockNavigate = jest.fn();
  
  const mockParty = {
    id: '1',
    name: 'Festa de Aniversário',
    date: '2026-05-10',
    location: 'São Paulo',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });

    (useRoute as jest.Mock).mockReturnValue({
      params: { party: mockParty },
    });
  });

  it('deve extrair a party corretamente dos parâmetros da rota', () => {
    const { party } = usePartyCreatedViewModel();

    expect(party).toEqual(mockParty);
    expect(party.name).toBe('Festa de Aniversário');
  });

  it('deve navegar para "Home" com a nova party ao chamar voltarParaHome', () => {
    const { voltarParaHome } = usePartyCreatedViewModel();

    voltarParaHome();

    expect(mockNavigate).toHaveBeenCalledWith('Home', {
      novaParty: mockParty,
    });
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});