import { renderHook } from '@testing-library/react-native'
import { useSelectInputViewModel, Props } from "./SelectInputViewModel";

describe("useSelectInputViewModel", () => {
  const mockOnValueChange = jest.fn();
  
  const defaultProps: Props = {
    label: "Selecione uma opção",
    selectedValue: "Opção 1",
    onValueChange: mockOnValueChange,
    options: ["Opção 1", "Opção 2", "Opção 3"],
  };

  it("deve retornar exatamente os mesmos valores passados por parâmetro", () => {
    const { result } = renderHook(() => useSelectInputViewModel(defaultProps));

    expect(result.current.label).toBe(defaultProps.label);
    expect(result.current.selectedValue).toBe(defaultProps.selectedValue);
    expect(result.current.options).toEqual(defaultProps.options);
    expect(result.current.onValueChange).toBe(defaultProps.onValueChange);
  });

  it("deve disparar a função onValueChange corretamente quando invocada do retorno", () => {
    const { result } = renderHook(() => useSelectInputViewModel(defaultProps));

    result.current.onValueChange("Opção 2");

    expect(mockOnValueChange).toHaveBeenCalledTimes(1);
    expect(mockOnValueChange).toHaveBeenCalledWith("Opção 2");
  });
});