import { renderHook } from '@testing-library/react-native';
import { useButtonViewModel, Props } from './ButtonViewModel';
import { theme } from "../../styles/theme";
import { styles } from "./styles";

describe('useButtonViewModel', () => {
  const defaultProps: Props = {
    title: 'Clique aqui',
  };

  it('deve retornar os valores padrão corretamente', () => {
    const { result } = renderHook(() => useButtonViewModel(defaultProps));

    expect(result.current.title).toBe('Clique aqui');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.loadingColor).toBe("#FFF");
  });

  it('deve ficar desabilitado se isLoading for true', () => {
    const { result } = renderHook(() => 
      useButtonViewModel({ ...defaultProps, isLoading: true })
    );

    expect(result.current.isDisabled).toBe(true);
  });

  it('deve aplicar a cor de loading correta para variantes "outline" ou "text"', () => {
    const { result: resultOutline } = renderHook(() => 
      useButtonViewModel({ ...defaultProps, variant: 'outline' })
    );
    const { result: resultText } = renderHook(() => 
      useButtonViewModel({ ...defaultProps, variant: 'text' })
    );

    expect(resultOutline.current.loadingColor).toBe(theme.colors.primary);
    expect(resultText.current.loadingColor).toBe(theme.colors.primary);
  });

  it('deve compor os estilos corretamente baseados na variante', () => {
    const { result } = renderHook(() => 
      useButtonViewModel({ ...defaultProps, variant: 'accent' })
    );

    expect(result.current.touchableOpacityStyles).toContain(styles.base);
    expect(result.current.touchableOpacityStyles).toContain(styles.accent);
    
    expect(result.current.textStyles).toContain(styles.textBase);
    expect(result.current.textStyles).toContain(styles.accentText);
  });

  it('deve permitir a sobreposição de estilos via props', () => {
    const customStyle = { marginTop: 10 };
    const { result } = renderHook(() => 
      useButtonViewModel({ ...defaultProps, style: customStyle })
    );

    expect(result.current.touchableOpacityStyles).toContain(customStyle);
  });

  it('deve separar as propriedades nativas do TouchableOpacity', () => {
    const onPressMock = jest.fn();
    const { result } = renderHook(() => 
      useButtonViewModel({ ...defaultProps, onPress: onPressMock, activeOpacity: 0.7 })
    );

    expect(result.current.touchableOpacityProps).toHaveProperty('onPress', onPressMock);
    expect(result.current.touchableOpacityProps).toHaveProperty('activeOpacity', 0.7);
  });
});