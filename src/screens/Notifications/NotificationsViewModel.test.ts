import { renderHook, act } from '@testing-library/react-native';
import { useNotificationsViewModel } from './NotificationsViewModel';
import { useNotification } from '../../contexts/NotificationContext/NotificationContext';
import { useNavigation } from '@react-navigation/native';
import { AppNotification } from '../../types/AppNotification';

jest.mock('../../contexts/NotificationContext/NotificationContext', () => ({
    useNotification: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn()
}));

describe('NotificationsViewModel', () => {
    const mockNavigate = jest.fn();
    const mockMarkAsRead = jest.fn();
    const mockMarkAllAsRead = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
        (useNotification as jest.Mock).mockReturnValue({
            notifications: [],
            markAsRead: mockMarkAsRead,
            markAllAsRead: mockMarkAllAsRead
        });
    });

    it('deve retornar as notificações do contexto', () => {
        const notifications = [{ id: '1', title: 'Test', read: false } as AppNotification];
        (useNotification as jest.Mock).mockReturnValue({
            notifications,
            markAsRead: mockMarkAsRead,
            markAllAsRead: mockMarkAllAsRead
        });

        const { result } = renderHook(() => useNotificationsViewModel());

        expect(result.current.notifications).toEqual(notifications);
    });

    it('deve marcar como lida e navegar ao clicar em notificação não lida com party', async () => {
        const notification = { id: '1', title: 'Test', read: false, related_party_id: 'party-1' } as AppNotification;
        const { result } = renderHook(() => useNotificationsViewModel());

        await act(async () => {
            await result.current.handleNotificationPress(notification);
        });

        expect(mockMarkAsRead).toHaveBeenCalledWith('1');
        expect(mockNavigate).toHaveBeenCalledWith('Home', { openPartyId: 'party-1', notificationType: undefined });
    });

    it('deve apenas navegar ao clicar em notificação lida com party', async () => {
        const notification = { id: '1', title: 'Test', read: true, related_party_id: 'party-1' } as AppNotification;
        const { result } = renderHook(() => useNotificationsViewModel());

        await act(async () => {
            await result.current.handleNotificationPress(notification);
        });

        expect(mockMarkAsRead).not.toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('Home', { openPartyId: 'party-1', notificationType: undefined });
    });

    it('deve chamar markAllAsRead ao handleMarkAllAsRead', async () => {
        const { result } = renderHook(() => useNotificationsViewModel());

        await act(async () => {
            await result.current.handleMarkAllAsRead();
        });

        expect(mockMarkAllAsRead).toHaveBeenCalled();
    });
});
