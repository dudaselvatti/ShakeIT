import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAddDependentModalViewModel } from './AddDependentModalViewModel';
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { getDependentsByUser } from "../../services/cloud/Dependent/DependentDb";
import { createDependentPartyParticipant } from "../../services/cloud/PartyParticipant/PartyParticipantDb";
import { getOrCreateWishlist } from "../../services/cloud/Wishlist/WishlistDb";

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../services/cloud/Dependent/DependentDb', () => ({
    getDependentsByUser: jest.fn(),
}));

jest.mock('../../services/cloud/PartyParticipant/PartyParticipantDb', () => ({
    createDependentPartyParticipant: jest.fn(),
}));

jest.mock('../../services/cloud/Wishlist/WishlistDb', () => ({
    getOrCreateWishlist: jest.fn(),
}));

describe('useAddDependentModalViewModel', () => {
    const mockUsuarioAtual = { id: 'user-123' };
    const mockDependents = [{ id: 'dep-1', name: 'Child 1' }, { id: 'dep-2', name: 'Pet 1' }];

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({ usuarioAtual: mockUsuarioAtual });
        (getDependentsByUser as jest.Mock).mockResolvedValue(mockDependents);
        (getOrCreateWishlist as jest.Mock).mockResolvedValue({ likes_tags: [], avoids_tags: [] });
    });

    it('should load dependents when visible', async () => {
        const { result } = renderHook(() => useAddDependentModalViewModel({
            visible: true,
            partyId: 'party-1',
            onClose: jest.fn(),
            onDependentAdded: jest.fn(),
        }));

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.dependents).toEqual(mockDependents);
        });
    });

    it('should add dependent and call onDependentAdded', async () => {
        const mockOnDependentAdded = jest.fn();
        const { result } = renderHook(() => useAddDependentModalViewModel({
            visible: true,
            partyId: 'party-1',
            onClose: jest.fn(),
            onDependentAdded: mockOnDependentAdded,
        }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            await result.current.handleAdd(mockDependents[0] as any);
        });

        expect(getOrCreateWishlist).toHaveBeenCalledWith('dep-1', 'dependent');
        expect(createDependentPartyParticipant).toHaveBeenCalled();
        expect(mockOnDependentAdded).toHaveBeenCalled();
    });
});
