import { renderHook } from "@testing-library/react-native";
import { useRestrictionCardViewModel, Props } from "./RestrictionCardViewModel";
import { RestrictionDirection } from "../../types/DrawRestriction";

describe("useRestrictionCardViewModel", () => {
  const mockOnPress = jest.fn();

  const defaultProps: Props = {
    personAName: "Carlos",
    personBName: "Diana",
    restrictionDirection: "one_way" as RestrictionDirection,
    onPress: mockOnPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar exatamente as mesmas propriedades passadas como argumento", () => {
    const { result } = renderHook(() => useRestrictionCardViewModel(defaultProps));

    expect(result.current.personAName).toBe("Carlos");
    expect(result.current.personBName).toBe("Diana");
    expect(result.current.restrictionDirection).toBe("one_way");
    expect(result.current.onPress).toBe(mockOnPress);
  });

  it("deve manter a integridade da função onPress quando disparada do retorno", () => {
    const { result } = renderHook(() => useRestrictionCardViewModel(defaultProps));

    result.current.onPress();

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("deve atualizar corretamente caso mude o tipo de restrição para 'both_ways'", () => {
    const customProps: Props = {
      ...defaultProps,
      restrictionDirection: "both_ways" as RestrictionDirection,
    };

    const { result } = renderHook(() => useRestrictionCardViewModel(customProps));

    expect(result.current.restrictionDirection).toBe("both_ways");
  });
});