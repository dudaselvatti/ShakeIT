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

  it('deve repassar a propriedade rightElement corretamente', () => {
    const mockProps: Props = {
      title: 'Notificações',
      rightElement: 'SwitchMock',
    };

    const { result } = renderHook(() => useSettingsOptionViewModel(mockProps));

    expect(result.current.rightElement).toBe('SwitchMock');
  });

  it('deve repassar a propriedade children corretamente', () => {
    const mockChildren = 'Conteúdo de Teste'; 
    const mockProps: Props = {
      title: 'Configurações Avançadas',
      children: mockChildren,
    };

    const { result } = renderHook(() => useSettingsOptionViewModel(mockProps));

    expect(result.current.children).toBe(mockChildren);
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