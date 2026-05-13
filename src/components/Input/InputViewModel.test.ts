import { renderHook } from "@testing-library/react-native";
import { useInputViewModel, Props } from "./InputViewModel";

jest.mock("./styles", () => ({
  styles: {
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
    },
  },
}));

describe("useInputViewModel", () => {
  const defaultProps: Props = {
    label: "Nome do Usuário",
  };

  it("deve retornar o label corretamente", () => {
    const { result } = renderHook(() => useInputViewModel(defaultProps));

    expect(result.current.label).toBe("Nome do Usuário");
  });

  it("deve compor o array de estilos do TextInput com o estilo base e o estilo customizado", () => {
    const customStyle = { color: "red" };
    const { result } = renderHook(() =>
      useInputViewModel({ ...defaultProps, style: customStyle })
    );

    expect(result.current.textInputStyle).toContainEqual({
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
    });
    
    expect(result.current.textInputStyle).toContainEqual(customStyle);
  });

  it("deve retornar o containerStyle quando fornecido", () => {
    const containerStyle = { margin: 20 };
    const { result } = renderHook(() =>
      useInputViewModel({ ...defaultProps, containerStyle })
    );

    expect(result.current.containerStyle).toEqual(containerStyle);
  });

  it("deve repassar as demais propriedades do TextInput (rest props)", () => {
    const { result } = renderHook(() =>
      useInputViewModel({
        ...defaultProps,
        placeholder: "Digite aqui...",
        secureTextEntry: true,
        keyboardType: "email-address",
      })
    );

    expect(result.current.placeholder).toBe("Digite aqui...");
    expect(result.current.secureTextEntry).toBe(true);
    expect(result.current.keyboardType).toBe("email-address");
  });

  it("deve manter a referência de funções passadas via props", () => {
    const onChangeTextMock = jest.fn();
    const { result } = renderHook(() =>
      useInputViewModel({ ...defaultProps, onChangeText: onChangeTextMock })
    );

    expect(result.current.onChangeText).toBe(onChangeTextMock);
  });
});