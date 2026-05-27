import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { RegistrationScreen } from "./index";
import { useRegistrationViewModel } from "./RegistrationViewModel";

jest.mock("./RegistrationViewModel");

jest.mock("../../components/AppHeader", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require("react-native");
  return {
    AppHeader: ({ onBackPress, headerTitle }: any) => (
      <View testID="app-header" title={headerTitle} onPress={onBackPress} />
    ),
  };
});

jest.mock("../../components/AppFooter", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require("react-native");
  return {
    AppFooter: ({ onNavigateIntercept }: any) => (
      <View testID="app-footer" onNavigate={onNavigateIntercept} />
    ),
  };
});

jest.mock("../../components/Button", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View, Text } = require("react-native");
  return {
    Button: ({ title, disabled, onPress }: any) => (
      <View
        testID="custom-button"
        accessibilityState={{ disabled }}
        onPress={onPress}
      >
        <Text>{title}</Text>
      </View>
    ),
  };
});

jest.mock("../../components/Input", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require("react-native");
  return {
    Input: ({ label, value, onChangeText, placeholder }: any) => (
      <View
        testID={`input-${label}`}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    ),
  };
});

jest.mock("../../components/SelectInput", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require("react-native");

  return {
    SelectInput: ({ label, selectedValue, onValueChange }: any) => (
      <View
        testID={`select-${label}`}
        value={selectedValue}
        onChange={onValueChange}
      />
    ),
  };
});

jest.mock("../../components/PopupModal", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { View } = require("react-native");

  return {
    PopupModal: ({ visible, onCancel, onConfirm }: any) =>
      visible ? (
        <View
          testID="popup-modal"
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      ) : null,
  };
});

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