import { renderHook } from '@testing-library/react-native';
import { useSettingsOptionViewModel, Props } from './SettingsOptionViewModel';

describe('useSettingsOptionViewModel', () => {
  it('deve retornar as propriedades obrigatórias corretamente', () => {
    const mockProps: Props = {
      title: 'Segurança',
    };

    const { result } = renderHook(() => useSettingsOptionViewModel(mockProps));

    expect(result.current.title).toBe('Segurança');
  });

  it('deve aplicar os valores padrão (default/fallback) quando as propriedades opcionais não forem informadas', () => {
    const mockProps: Props = {
      title: 'Notificações',
    };

    const { result } = renderHook(() => useSettingsOptionViewModel(mockProps));

    expect(result.current.iconName).toBe('chevron-right');
    
    expect(result.current.iconSize).toBeUndefined();
    expect(result.current.iconColor).toBeUndefined();
  });

  it('deve sobrescrever os valores padrão quando propriedades opcionais forem fornecidas', () => {
    const mockProps: Props = {
      title: 'Privacidade',
      iconName: 'lock',
      iconSize: 20,
      iconColor: '#FF0000',
    };

    const { result } = renderHook(() => useSettingsOptionViewModel(mockProps));

    expect(result.current.iconName).toBe('lock');
    expect(result.current.iconSize).toBe(20);
    expect(result.current.iconColor).toBe('#FF0000');
  });

  it('deve repassar (forward) todas as propriedades adicionais do TouchableOpacityProps', () => {
    const mockOnPress = jest.fn();
    const mockProps: Props = {
      title: 'Sair',
      onPress: mockOnPress,
      disabled: true,
      activeOpacity: 0.5,
    };

    const { result } = renderHook(() => useSettingsOptionViewModel(mockProps));

    expect(result.current.onPress).toBe(mockOnPress);
    expect(result.current.disabled).toBe(true);
    expect(result.current.activeOpacity).toBe(0.5);
  });
});