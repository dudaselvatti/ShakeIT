import { renderHook, act } from '@testing-library/react-native';
import { useAppNotificationToastViewModel } from './AppNotificationToastViewModel';

describe('AppNotificationToastViewModel', () => {
    it('deve repassar o title e message corretos', () => {
        const props = { title: 'Test Title', message: 'Test Message' };
        const { result } = renderHook(() => useAppNotificationToastViewModel(props));

        expect(result.current.title).toBe('Test Title');
        expect(result.current.message).toBe('Test Message');
    });

    it('deve chamar onPress quando handlePress for chamado', () => {
        const mockOnPress = jest.fn();
        const props = { title: 'Test', message: 'Test', onPress: mockOnPress };
        const { result } = renderHook(() => useAppNotificationToastViewModel(props));

        act(() => {
            result.current.handlePress();
        });

        expect(mockOnPress).toHaveBeenCalled();
    });

    it('deve chamar onClose quando handleClose for chamado', () => {
        const mockOnClose = jest.fn();
        const props = { title: 'Test', message: 'Test', onClose: mockOnClose };
        const { result } = renderHook(() => useAppNotificationToastViewModel(props));

        act(() => {
            result.current.handleClose();
        });

        expect(mockOnClose).toHaveBeenCalled();
    });
});
