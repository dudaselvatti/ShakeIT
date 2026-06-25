import { renderHook, waitFor } from '@testing-library/react-native';
import { usePartyCreatedViewModel } from './PartyCreatedViewModel';
import { useRoute, useNavigation } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { getPartyFromCloud } from '../../services/cloud/Party/PartyDb';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock('../../services/cloud/Party/PartyDb', () => ({
  getPartyFromCloud: jest.fn(),
}));

const mockGetPartyFromCloud = getPartyFromCloud as jest.Mock;

describe('usePartyCreatedViewModel', () => {
  const mockNavigate = jest.fn();
  let queryClient: QueryClient;
  
  const mockParty = {
    id: '1',
    name: 'Festa de Aniversário',
    date: '2026-05-10',
    location: 'São Paulo',
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });

    (useRoute as jest.Mock).mockReturnValue({
      params: { partyId: '1' },
    });
    
    mockGetPartyFromCloud.mockResolvedValue(mockParty);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('deve extrair a party corretamente via React Query', async () => {
    const { result } = renderHook(() => usePartyCreatedViewModel(), { wrapper });

    await waitFor(() => {
      expect(result.current.party).toEqual(mockParty);
      expect(result.current.party?.name).toBe('Festa de Aniversário');
    });
  });

  it('deve navegar para "Home" ao chamar voltarParaHome sem passar dados pesados', () => {
    const { result } = renderHook(() => usePartyCreatedViewModel(), { wrapper });

    result.current.voltarParaHome();

    expect(mockNavigate).toHaveBeenCalledWith('Home');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
