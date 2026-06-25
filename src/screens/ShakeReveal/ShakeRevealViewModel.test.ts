import { renderHook } from '@testing-library/react-native';
import { useShakeRevealViewModel } from './ShakeRevealViewModel';
import { useRoute } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));
jest.mock('../../contexts/AuthContext/AuthContext', () => ({
  useAuth: jest.fn(() => ({ usuarioAtual: { id: 'test' } })),
}));
jest.mock('../../services/cloud/PartyParticipant/PartyParticipantDb', () => ({}));
jest.mock('../../services/cloud/DrawResult/DrawResultDb', () => ({}));

describe('useShakeRevealViewModel', () => {
  it('should initialize correctly', () => {
    (useRoute as jest.Mock).mockReturnValue({ params: { partyId: '1' } });
    const { result } = renderHook(() => useShakeRevealViewModel({ route: { params: { partyId: '1' } }, navigation: {} }));
    expect(result.current.hasShaken).toBe(false);
  });
});