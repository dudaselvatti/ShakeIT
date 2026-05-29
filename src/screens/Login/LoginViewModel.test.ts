import { renderHook, act } from "@testing-library/react-native";
import { useLoginViewModel } from "./LoginViewModel";
import { isValidEmail } from "../../utils/Formatting/isValidEmail";

jest.mock("../../utils/Formatting/isValidEmail");
const mockIsValidEmail = isValidEmail as jest.Mock;

describe("useLoginViewModel", () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsValidEmail.mockReturnValue(true);
  });

  describe("Valores Iniciais", () => {
    it("deve inicializar com valores vazios e sem erros", () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      expect(result.current.email).toBe("");
      expect(result.current.senha).toBe("");
      expect(result.current.errors).toEqual({ email: "", senha: "" });
    });
  });

  describe("Atualização de Estados", () => {
    it("deve atualizar o email corretamente e limpar o erro de email se existir", () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      act(() => {
        result.current.handleAutenticarUsuario();
      });
      expect(result.current.errors.email).toBe("Insira seu email.");

      act(() => {
        result.current.updateEmail("teste@exemplo.com");
      });

      expect(result.current.email).toBe("teste@exemplo.com");
      expect(result.current.errors.email).toBe("");
    });

    it("deve atualizar a senha corretamente e limpar o erro de senha se existir", () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      act(() => {
        result.current.handleAutenticarUsuario();
      });
      expect(result.current.errors.senha).toBe("Insira sua senha.");

      act(() => {
        result.current.updateSenha("senha123");
      });

      expect(result.current.senha).toBe("senha123");
      expect(result.current.errors.senha).toBe("");
    });
  });

  describe("Navegação", () => {
    it("deve chamar navigation.goBack ao acionar handleBackPress", () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      act(() => {
        result.current.handleBackPress();
      });

      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });

    it("deve navegar para a tela Registration ao acionar handleRegistrationNavigate", () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      act(() => {
        result.current.handleRegistrationNavigate();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith("Registration");
    });

    it("deve navegar para a tela ForgotMyPassword ao acionar handleForgotMyPasswordNavigate", () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      act(() => {
        result.current.handleForgotMyPasswordNavigate();
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith("ForgotMyPassword");
    });
  });

  describe("Validação e Autenticação (handleAutenticarUsuario)", () => {
    it("deve setar erros se email e senha estiverem vazios", async () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      await act(async () => {
        await result.current.handleAutenticarUsuario();
      });

      expect(result.current.errors).toEqual({
        email: "Insira seu email.",
        senha: "Insira sua senha.",
      });
    });

    it("deve setar erro se o email for inválido pela função utilitária", async () => {
      mockIsValidEmail.mockReturnValueOnce(false);
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      act(() => {
        result.current.updateEmail("email-invalido");
        result.current.updateSenha("123456");
      });

      await act(async () => {
        await result.current.handleAutenticarUsuario();
      });

      expect(mockIsValidEmail).toHaveBeenCalledWith("email-invalido");
      expect(result.current.errors.email).toBe("Email inválido.");
      expect(result.current.errors.senha).toBe("");
    });

    it("deve passar na validação sem erros se email e senha forem válidos", async () => {
      const { result } = renderHook(() => useLoginViewModel(mockNavigation));

      act(() => {
        result.current.updateEmail("correto@email.com");
        result.current.updateSenha("minhasenha");
      });

      await act(async () => {
        await result.current.handleAutenticarUsuario();
      });

      expect(result.current.errors).toEqual({ email: "", senha: "" });
    });
  });
});