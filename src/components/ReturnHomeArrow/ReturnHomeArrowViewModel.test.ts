import { renderHook } from '@testing-library/react-native';
import { useReturnHomeArrowViewModel } from './ReturnHomeArrowViewModel';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('useReturnHomeArrowViewModel', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('deve chamar navigation.navigate com "Home" quando handlePress for executado', () => {
    const { result } = renderHook(() => useReturnHomeArrowViewModel());

    result.current.handlePress();

    expect(mockNavigate).toHaveBeenCalledWith('Home');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('deve retornar a função handlePress', () => {
    const { result } = renderHook(() => useReturnHomeArrowViewModel());

    expect(typeof result.current.handlePress).toBe('function');
  });
});