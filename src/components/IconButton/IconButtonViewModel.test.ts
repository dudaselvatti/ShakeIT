import { renderHook } from "@testing-library/react-native";
import { useIconButtonViewModel, Props } from "./IconButtonViewModel";
import { theme } from "../../styles/theme";

jest.mock("./styles", () => ({
  styles: {
    base: { padding: 10 },
    fab: { borderRadius: 50 },
    transparent: { backgroundColor: "transparent" },
  },
}));

describe("useIconButtonViewModel", () => {
  const defaultProps: Props = {
    iconName: "plus",
  };

  it("deve retornar valores padrão quando o variant é 'transparent'", () => {
    const { result } = renderHook(() => useIconButtonViewModel(defaultProps));

    expect(result.current.iconColor).toBe(theme.colors.text);
    expect(result.current.iconSize).toBe(24);
    expect(result.current.iconName).toBe("plus");
  });

  it("deve retornar valores específicos quando o variant é 'fab'", () => {
    const { result } = renderHook(() =>
      useIconButtonViewModel({ ...defaultProps, variant: "fab" })
    );

    expect(result.current.iconColor).toBe(theme.colors.surface);
    expect(result.current.iconSize).toBe(32);
  });

  it("deve priorizar a cor e o tamanho passados via props", () => {
    const customProps: Props = {
      ...defaultProps,
      color: "#FF0000",
      size: 40,
    };

    const { result } = renderHook(() => useIconButtonViewModel(customProps));

    expect(result.current.iconColor).toBe("#FF0000");
    expect(result.current.iconSize).toBe(40);
  });

  it("deve compor os estilos corretamente baseado no variant", () => {
    const { result } = renderHook(() =>
      useIconButtonViewModel({ ...defaultProps, variant: "fab" })
    );

    expect(result.current.touchableOpacityStyles).toContain(result.current.touchableOpacityStyles[0]);
    expect(result.current.touchableOpacityStyles).toContain(result.current.touchableOpacityStyles[1]);
  });

  it("deve repassar as demais propriedades do TouchableOpacity", () => {
    const onPressMock = jest.fn();
    const { result } = renderHook(() =>
      useIconButtonViewModel({ ...defaultProps, onPress: onPressMock, activeOpacity: 0.7 })
    );

    expect(result.current.onPress).toBe(onPressMock);
    expect(result.current.activeOpacity).toBe(0.7);
  });
});