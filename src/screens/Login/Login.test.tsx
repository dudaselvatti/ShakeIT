import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { LoginScreen } from "./index";
import { useLoginViewModel } from "./LoginViewModel";

jest.mock("./LoginViewModel");

const mockUseLoginViewModel = useLoginViewModel as jest.Mock;

describe("LoginScreen", () => {
  const mockUpdateEmail = jest.fn();
  const mockUpdateSenha = jest.fn();
  const mockHandleBackPress = jest.fn();
  const mockHandleRegistrationNavigate = jest.fn();
  const mockHandleForgotMyPasswordNavigate = jest.fn();
  const mockHandleAutenticarUsuario = jest.fn();

  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLoginViewModel.mockReturnValue({
      email: "",
      updateEmail: mockUpdateEmail,
      senha: "",
      updateSenha: mockUpdateSenha,
      errors: { email: "", senha: "", firebase: "" },
      handleBackPress: mockHandleBackPress,
      handleRegistrationNavigate: mockHandleRegistrationNavigate,
      handleForgotMyPasswordNavigate: mockHandleForgotMyPasswordNavigate,
      handleAutenticarUsuario: mockHandleAutenticarUsuario,
    });
  });

  it("deve renderizar os elementos da tela corretamente", () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    expect(getByText("Login")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Senha")).toBeTruthy();
    expect(getByText("Entrar")).toBeTruthy();
    expect(getByText("Criar Conta")).toBeTruthy();
    expect(getByText("Esqueci minha senha")).toBeTruthy();
  });

  it("deve chamar updateEmail e updateSenha quando o texto mudar", () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText("Email");
    const senhaInput = getByPlaceholderText("Senha");

    fireEvent.changeText(emailInput, "teste@email.com");
    fireEvent.changeText(senhaInput, "123456");

    expect(mockUpdateEmail).toHaveBeenCalledWith("teste@email.com");
    expect(mockUpdateSenha).toHaveBeenCalledWith("123456");
  });

  it("deve exibir mensagens de erro locais quando existirem no ViewModel", () => {
    mockUseLoginViewModel.mockReturnValueOnce({
      email: "user@teste.com",
      updateEmail: mockUpdateEmail,
      senha: "123",
      updateSenha: mockUpdateSenha,
      errors: {
        email: "E-mail inválido",
        senha: "Senha muito curta",
        firebase: "",
      },
      handleBackPress: mockHandleBackPress,
      handleRegistrationNavigate: mockHandleRegistrationNavigate,
      handleForgotMyPasswordNavigate: mockHandleForgotMyPasswordNavigate,
      handleAutenticarUsuario: mockHandleAutenticarUsuario,
    });

    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);

    expect(getByText("E-mail inválido")).toBeTruthy();
    expect(getByText("Senha muito curta")).toBeTruthy();
  });

  it("deve exibir mensagem de erro do Firebase quando retornar da autenticação", () => {
    mockUseLoginViewModel.mockReturnValueOnce({
      email: "correto@teste.com",
      updateEmail: mockUpdateEmail,
      senha: "senha-errada",
      updateSenha: mockUpdateSenha,
      errors: {
        email: "",
        senha: "",
        firebase: "E-mail ou senha incorretos.",
      },
      handleBackPress: mockHandleBackPress,
      handleRegistrationNavigate: mockHandleRegistrationNavigate,
      handleForgotMyPasswordNavigate: mockHandleForgotMyPasswordNavigate,
      handleAutenticarUsuario: mockHandleAutenticarUsuario,
    });

    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);

    expect(getByText("E-mail ou senha incorretos.")).toBeTruthy();
  });

  it("deve chamar handleAutenticarUsuario ao clicar em Entrar", () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);

    const botaoEntrar = getByText("Entrar");
    fireEvent.press(botaoEntrar);

    expect(mockHandleAutenticarUsuario).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleRegistrationNavigate ao clicar em Criar Conta", () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);

    const botaoCriarConta = getByText("Criar Conta");
    fireEvent.press(botaoCriarConta);

    expect(mockHandleRegistrationNavigate).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleForgotMyPasswordNavigate ao clicar em Esqueci minha senha", () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);

    const botaoEsqueciSenha = getByText("Esqueci minha senha");
    fireEvent.press(botaoEsqueciSenha);

    expect(mockHandleForgotMyPasswordNavigate).toHaveBeenCalledTimes(1);
  });
});