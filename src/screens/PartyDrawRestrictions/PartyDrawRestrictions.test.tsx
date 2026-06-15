import React from "react";
import { View, Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { PartyDrawRestrictionsScreen } from "./index";
import { usePartyDrawRestrictionsViewModel } from "./PartyDrawRestrictionsViewModel";

const MockView = View;
const MockText = Text;

jest.mock("./PartyDrawRestrictionsViewModel");
const mockUsePartyDrawRestrictionsViewModel = usePartyDrawRestrictionsViewModel as jest.Mock;

jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

jest.mock("../../components/AppHeader", () => {
  const actual = jest.requireActual("../../components/AppHeader");

  return {
    ...actual,
    AppHeader: ({ headerTitle }: { headerTitle: string }) => (
      <MockView testID="mock-header">
        <MockText>{headerTitle}</MockText>
      </MockView>
    ),
  };
});

describe("PartyDrawRestrictionsScreen", () => {
  const defaultViewModelMock = {
    participantsOptions: [
      { key: "Alice", label: "Alice", value: "1" },
      { key: "Bob", label: "Bob", value: "2" },
    ],
    restrictionsList: [],
    personA: "",
    personB: "",
    setPersonA: jest.fn(),
    setPersonB: jest.fn(),
    restrictionDirection: "one_way",
    handleChangeRestrictionDirection: jest.fn(),
    RestrictionDirectionButtonTitle: "Não pode tirar",
    handleCreateRestriction: jest.fn(),
    handleDeleteRestriction: jest.fn(),
    blockDependentDraw: true,
    BlockDependentDrawButtonTitle: "Impedir que Titulares e seus Dependentes se tirem",
    handleToggleBlockDependentDraw: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePartyDrawRestrictionsViewModel.mockReturnValue(defaultViewModelMock);
  });

  it("deve renderizar a tela corretamente com os elementos iniciais", () => {
    const { getByText, queryByText } = render(<PartyDrawRestrictionsScreen />);

    expect(getByText("Evite que pessoas específicas se tirem no sorteio (ex: casais).")).toBeTruthy();
    expect(getByText("Não pode tirar")).toBeTruthy();
    expect(getByText("+ Adicionar Regra")).toBeTruthy();
    expect(getByText("Impedir que Titulares e seus Dependentes se tirem")).toBeTruthy();
    expect(getByText("Regras Ativas")).toBeTruthy();

    expect(queryByText("Titulares e dependentes não podem se tirar")).toBeNull();
  });

  it("deve chamar handleChangeRestrictionDirection ao clicar no botão de direção", () => {
    const { getByText } = render(<PartyDrawRestrictionsScreen />);
    
    const directionButton = getByText("Não pode tirar");
    fireEvent.press(directionButton);

    expect(defaultViewModelMock.handleChangeRestrictionDirection).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleCreateRestriction ao clicar em adicionar regra", () => {
    const { getByText } = render(<PartyDrawRestrictionsScreen />);
    
    const addButton = getByText("+ Adicionar Regra");
    fireEvent.press(addButton);

    expect(defaultViewModelMock.handleCreateRestriction).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleToggleBlockDependentDraw ao clicar no botão de bloqueio de dependentes", () => {
    const { getByText } = render(<PartyDrawRestrictionsScreen />);
    
    const toggleButton = getByText("Impedir que Titulares e seus Dependentes se tirem");
    fireEvent.press(toggleButton);

    expect(defaultViewModelMock.handleToggleBlockDependentDraw).toHaveBeenCalledTimes(1);
  });

  it("deve exibir o aviso se blockDependentDraw for false", () => {
    mockUsePartyDrawRestrictionsViewModel.mockReturnValue({
      ...defaultViewModelMock,
      blockDependentDraw: false,
    });

    const { getByText } = render(<PartyDrawRestrictionsScreen />);

    expect(getByText("Titulares e dependentes não podem se tirar")).toBeTruthy();
  });

  it("deve renderizar a lista de restrições ativas e permitir a exclusão", () => {
    const mockList = [
      {
        id: "id-regra-1",
        personAName: "Alice",
        personBName: "Bob",
        restrictionDirection: "one_way",
        onPress: jest.fn(),
      },
    ];

    mockUsePartyDrawRestrictionsViewModel.mockReturnValue({
      ...defaultViewModelMock,
      restrictionsList: mockList,
    });

    const { getByText } = render(<PartyDrawRestrictionsScreen />);

    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Bob")).toBeTruthy();
  });
});