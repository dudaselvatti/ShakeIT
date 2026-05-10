import { renderHook } from "@testing-library/react-native";
import { useMockButtonViewModel, Props } from "./MockButtonViewModel";

describe("useMockButtonViewModel", () => {
  const defaultProps: Props = {
    title: "Clique Aqui",
  };

  it("deve retornar o título corretamente", () => {
    const { result } = renderHook(() => useMockButtonViewModel(defaultProps));

    expect(result.current.title).toBe("Clique Aqui");
  });

  it("deve repassar todas as propriedades do TouchableOpacity (spread)", () => {
    const onPressMock = jest.fn();
    const { result } = renderHook(() =>
      useMockButtonViewModel({
        ...defaultProps,
        onPress: onPressMock,
        disabled: true,
        activeOpacity: 0.5,
      })
    );

    expect(result.current.onPress).toBe(onPressMock);
    expect(result.current.disabled).toBe(true);
    expect(result.current.activeOpacity).toBe(0.5);
  });

  it("deve manter a integridade dos dados quando as props mudam", () => {
    const { result, rerender } = renderHook(
      (props: Props) => useMockButtonViewModel(props),
      {
        initialProps: defaultProps,
      }
    );

    expect(result.current.title).toBe("Clique Aqui");

    rerender({ title: "Novo Título" });

    expect(result.current.title).toBe("Novo Título");
  });
});