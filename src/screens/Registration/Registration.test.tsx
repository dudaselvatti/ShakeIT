import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { RegistrationScreen } from "./index";
import { useRegistrationViewModel } from "./RegistrationViewModel";

jest.mock("./RegistrationViewModel");

jest.mock("../../components/AppHeader", () => ({
  AppHeader: ({ onBackPress, headerTitle }: any) => (
    <mock-AppHeader testID="app-header" title={headerTitle} onPress={onBackPress} />
  ),
}));

jest.mock("../../components/AppFooter", () => ({
  AppFooter: ({ onNavigateIntercept }: any) => (
    <mock-AppFooter testID="app-footer" onNavigate={onNavigateIntercept} />
  ),
}));

jest.mock("../../components/Button", () => {
  const { Text } = require("react-native");
  return {
    Button: ({ title, disabled, onPress }: any) => (
      <mock-Button
        testID="custom-button"
        accessibilityState={{ disabled }}
        onPress={onPress}
      >
        <Text>{title}</Text>
      </mock-Button>
    ),
  };
});

jest.mock("../../components/Input", () => ({
  Input: ({ label, value, onChangeText, placeholder }: any) => (
    <mock-Input
      testID={`input-${label}`}
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
    />
  ),
}));

jest.mock("../../components/SelectInput", () => ({
  SelectInput: ({ label, selectedValue, onValueChange }: any) => (
    <mock-SelectInput
      testID={`select-${label}`}
      value={selectedValue}
      onChange={onValueChange}
    />
  ),
}));

jest.mock("../../components/PopupModal", () => ({
  PopupModal: ({ visible, onCancel, onConfirm }: any) =>
    visible ? (
      <mock-PopupModal testID="popup-modal" onCancel={onCancel} onConfirm={onConfirm} />
    ) : null,
}));

describe("RegistrationScreen", () => {
  const mockNavigation = { navigate: jest.fn() };
  
  const defaultViewModelMock = {
    nomeUsuario: "",
    updateNomeUsuario: jest.fn(),
    email: "",
    updateEmail: jest.fn(),
    senha: "",
    updateSenha: jest.fn(),
    dataNascimento: null,
    updateDataNascimento: jest.fn(),
    avatarUrl: "",
    updateAvatarUrl: jest.fn(),
    bio: "",
    updateBio: jest.fn(),
    sizes: new Map(),
    updateSizes: jest.fn(),
    errors: {},
    isModalVisible: false,
    cancelExit: jest.fn(),
    handleBackPress: jest.fn(),
    handleFooterNavigate: jest.fn(),
    confirmExit: jest.fn(),
    handleCadastrarUsuario: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRegistrationViewModel as jest.Mock).mockReturnValue(defaultViewModelMock);
  });

  it("deve renderizar os campos básicos do formulário corretamente", () => {
    const { getByTestId, getByText } = render(
      <RegistrationScreen navigation={mockNavigation} />
    );

    expect(getByTestId("app-header")).toBeTruthy();
    expect(getByTestId("input-Nome de usuário")).toBeTruthy();
    expect(getByTestId("input-Email")).toBeTruthy();
    expect(getByTestId("input-Senha")).toBeTruthy();
    expect(getByText("Criar Conta")).toBeTruthy();
  });

  it("deve desabilitar o botão 'Criar Conta' se os campos obrigatórios estiverem vazios", () => {
  const { getByTestId } = render(<RegistrationScreen navigation={mockNavigation} />);
  
  const button = getByTestId("custom-button");

  expect(button.props.accessibilityState?.disabled).toBe(true);
});

  it("deve habilitar o botão 'Criar Conta' quando todos os campos obrigatórios estiverem preenchidos", () => {
		(useRegistrationViewModel as jest.Mock).mockReturnValue({
			...defaultViewModelMock,
			nomeUsuario: "John Doe",
			email: "john@example.com",
			senha: "Password123",
			dataNascimento: new Date("2000-01-01"),
		});

		const { getByTestId } = render(<RegistrationScreen navigation={mockNavigation} />);
		
		const button = getByTestId("custom-button");

		expect(button.props.accessibilityState?.disabled).toBeFalsy();
	});

  it("deve chamar updateNomeUsuario ao digitar no campo correspondente", () => {
    const { getByTestId } = render(<RegistrationScreen navigation={mockNavigation} />);
    const inputNome = getByTestId("input-Nome de usuário");

    fireEvent(inputNome, "onChangeText", "Novo Nome");
    expect(defaultViewModelMock.updateNomeUsuario).toHaveBeenCalledWith("Novo Nome");
  });

  it("deve exibir mensagens de erro quando passadas pelo ViewModel", () => {
    (useRegistrationViewModel as jest.Mock).mockReturnValue({
      ...defaultViewModelMock,
      errors: {
        nome: "Nome inválido",
        email: "Email já cadastrado",
      },
    });

    const { getByText } = render(<RegistrationScreen navigation={mockNavigation} />);

    expect(getByText("Nome inválido")).toBeTruthy();
    expect(getByText("Email já cadastrado")).toBeTruthy();
  });

  it("deve chamar handleCadastrarUsuario ao clicar no botão Criar Conta", () => {
		(useRegistrationViewModel as jest.Mock).mockReturnValue({
			...defaultViewModelMock,
			nomeUsuario: "John Doe",
			email: "john@example.com",
			senha: "Password123",
			dataNascimento: new Date("2000-01-01"),
		});

		const { getByTestId } = render(<RegistrationScreen navigation={mockNavigation} />);
		
		const button = getByTestId("custom-button");

		fireEvent.press(button);
		expect(defaultViewModelMock.handleCadastrarUsuario).toHaveBeenCalled();
	});

  it("deve exibir e interagir com o PopupModal quando isModalVisible for true", () => {
    (useRegistrationViewModel as jest.Mock).mockReturnValue({
      ...defaultViewModelMock,
      isModalVisible: true,
    });

    const { getByTestId } = render(<RegistrationScreen navigation={mockNavigation} />);
    const modal = getByTestId("popup-modal");

    expect(modal).toBeTruthy();

    fireEvent(modal, "onCancel");
    expect(defaultViewModelMock.cancelExit).toHaveBeenCalled();

    fireEvent(modal, "onConfirm");
    expect(defaultViewModelMock.confirmExit).toHaveBeenCalled();
  });

  it("deve atualizar os seletores de tamanhos corretamente", () => {
    const { getByTestId } = render(<RegistrationScreen navigation={mockNavigation} />);
    
    const selectCamiseta = getByTestId("select-Tamanho da Camiseta");
    fireEvent(selectCamiseta, "onChange", "M");

    expect(defaultViewModelMock.updateSizes).toHaveBeenCalledWith("camiseta", "M");
  });
});