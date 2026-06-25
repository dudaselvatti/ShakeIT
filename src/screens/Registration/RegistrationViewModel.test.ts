import { renderHook, act } from "@testing-library/react-native";
import { useRegistrationViewModel } from "./RegistrationViewModel";
import { isValidEmail } from "../../utils/Formatting/isValidEmail";
import { storeUserInCloud } from "../../services/cloud/User/UserDb";

jest.mock("../../utils/Formatting/isValidEmail");
const mockIsValidEmail = isValidEmail as jest.Mock;

jest.mock("../../services/cloud/User/UserDb", () => ({
  storeUserInCloud: jest.fn(),
}));
const mockStoreUserInCloud = storeUserInCloud as jest.Mock;

describe("useRegistrationViewModel", () => {
  let mockNavigation: { goBack: jest.Mock; navigate: jest.Mock; replace: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockNavigation = {
      goBack: jest.fn(),
      navigate: jest.fn(),
      replace: jest.fn(),
    };

    mockIsValidEmail.mockReturnValue(true);
    mockStoreUserInCloud.mockResolvedValue({ id: "mock-user-id" });
  });

  describe("Atualizações de Estado e Limpeza de Erros", () => {
    it("deve inicializar com os valores padrão corretos", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      expect(result.current.nomeUsuario).toBe("");
      expect(result.current.email).toBe("");
      expect(result.current.senha).toBe("");
      expect(result.current.genero).toBe("");
      expect(result.current.dataNascimento).toBeUndefined();
      expect(result.current.avatarUrl).toBe("");
      expect(result.current.bio).toBe("");
      expect(result.current.sizes.size).toBe(0);
      expect(result.current.isModalVisible).toBe(false);
      expect(result.current.errors).toEqual({ nome: "", email: "", senha: "", genero: "", data: "", firebase: "" });
    });

    it("deve atualizar o nome de usuário e limpar o erro correspondente", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.handleCadastrarUsuario();
      });
      expect(result.current.errors.nome).not.toBe("");

      act(() => {
        result.current.updateNomeUsuario("john_doe");
      });

      expect(result.current.nomeUsuario).toBe("john_doe");
      expect(result.current.errors.nome).toBe("");
    });

    it("deve atualizar o e-mail e limpar o erro correspondente", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.handleCadastrarUsuario();
      });
      expect(result.current.errors.email).not.toBe("");

      act(() => {
        result.current.updateEmail("john@example.com");
      });

      expect(result.current.email).toBe("john@example.com");
      expect(result.current.errors.email).toBe("");
    });

    it("deve atualizar o gênero e limpar o erro correspondente", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.handleCadastrarUsuario();
      });
      expect(result.current.errors.genero).not.toBe("");

      act(() => {
        result.current.updateGenero("Masculino");
      });

      expect(result.current.genero).toBe("Masculino");
      expect(result.current.errors.genero).toBe("");
    });

    it("deve atualizar a foto de perfil (avatarUrl) sem limpar erros", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.updateAvatarUrl("https://linkdafoto.com/avatar.png");
      });

      expect(result.current.avatarUrl).toBe("https://linkdafoto.com/avatar.png");
    });

    it("deve atualizar o mapa de tamanhos (sizes) corretamente", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.updateSizes("camiseta", "M");
        result.current.updateSizes("calca", "42");
      });

      expect(result.current.sizes.get("camiseta")).toBe("M");
      expect(result.current.sizes.get("calca")).toBe("42");
    });
  });

  describe("Fluxo de Navegação e Interceptação com Modal (hasChanges)", () => {
    it("deve voltar imediatamente ao acionar handleBackPress se não houver alterações", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.handleBackPress();
      });

      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
      expect(result.current.isModalVisible).toBe(false);
    });

    it("deve abrir o modal ao acionar handleBackPress se houver alterações pendentes (Ex: nomeUsuario preenchido)", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.updateNomeUsuario("Mudança");
      });

      act(() => {
        result.current.handleBackPress();
      });

      expect(mockNavigation.goBack).not.toHaveBeenCalled();
      expect(result.current.isModalVisible).toBe(true);
    });

    it("deve fechar o modal sem navegar ao acionar cancelExit", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.updateNomeUsuario("Felipe");
      });

      act(() => {
        result.current.handleBackPress();
      });

      expect(result.current.isModalVisible).toBe(true);

      act(() => {
        result.current.cancelExit();
      });

      expect(result.current.isModalVisible).toBe(false);
      expect(mockNavigation.goBack).not.toHaveBeenCalled();
    });

    it("deve confirmar a saída e dar goBack se o modal foi aberto sem rotas pendentes", () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.updateNomeUsuario("Felipe");
      });

      act(() => {
        result.current.handleBackPress();
      });

      expect(result.current.isModalVisible).toBe(true);

      act(() => {
        result.current.confirmExit();
      });

      expect(result.current.isModalVisible).toBe(false);
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Validação de Formulário e Cadastro", () => {
    it("deve invalidar o formulário e injetar erros se todos os campos obrigatórios estiverem vazios", async () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      await act(async () => {
        await result.current.handleCadastrarUsuario();
      });

      expect(result.current.errors.nome).toBe("O nome de usuário é obrigatório.");
      expect(result.current.errors.email).toBe("O email é obrigatório.");
      expect(result.current.errors.senha).toBe("A senha é obrigatória.");
      expect(result.current.errors.genero).toBe("O gênero é obrigatório.");
      expect(result.current.errors.data).toBe("A data de nascimento é obrigatória.");
    });

    it("deve aplicar erro específico de e-mail inválido se a utilitária retornar falso", async () => {
      mockIsValidEmail.mockReturnValueOnce(false);
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.updateNomeUsuario("user");
        result.current.updateEmail("email-errado");
        result.current.updateSenha("123");
        result.current.updateGenero("Feminino");
        result.current.updateDataNascimento(new Date());
        result.current.updateBio("Hello");
      });

      await act(async () => {
        await result.current.handleCadastrarUsuario();
      });

      expect(result.current.errors.email).toBe("Email inválido.");
      expect(result.current.errors.nome).toBe("");
    });

    it("deve passar na validação local, salvar na nuvem e dar um replace para Home", async () => {
      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.updateNomeUsuario("valid_user");
        result.current.updateEmail("test@test.com");
        result.current.updateSenha("123456");
        result.current.updateGenero("Outro");
        result.current.updateDataNascimento(new Date("2000-01-01"));
        result.current.updateBio("Sou um desenvolvedor");
      });

      await act(async () => {
        await result.current.handleCadastrarUsuario();
      });

      expect(result.current.errors).toEqual({ nome: "", email: "", senha: "", genero: "", data: "", firebase: "" });
      expect(mockStoreUserInCloud).toHaveBeenCalled();
      expect(mockNavigation.replace).toHaveBeenCalledWith("Home");
    });

    it("deve mapear erros do Firebase (email já em uso) se a promessa do Cloud falhar", async () => {
      const firebaseError = { code: "auth/email-already-in-use" };
      mockStoreUserInCloud.mockRejectedValueOnce(firebaseError);

      const { result } = renderHook(() => useRegistrationViewModel(mockNavigation));

      act(() => {
        result.current.updateNomeUsuario("valid_user");
        result.current.updateEmail("test@test.com");
        result.current.updateSenha("123456");
        result.current.updateGenero("Outro");
        result.current.updateDataNascimento(new Date("2000-01-01"));
      });

      await act(async () => {
        await result.current.handleCadastrarUsuario();
      });

      expect(result.current.errors.email).toBe("Este e-mail já está em uso. Tente outro ou faça login.");
    });
  });
});