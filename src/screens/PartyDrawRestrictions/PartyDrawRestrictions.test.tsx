import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { PartyDrawRestrictionsScreen } from "./index";
import { usePartyDrawRestrictionsViewModel } from "./PartyDrawRestrictionsViewModel";

// 1. Declare all mock variables here (prefixed with 'Mock')
const MockView = View;
const MockText = Text;
const MockTouchableOpacity = TouchableOpacity;

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

// 2. Update this mock to use the allowed 'Mock' prefixed variables
jest.mock("../../components/RestrictionCard", () => ({
  RestrictionCard: ({ personAName, personBName, onPress }: any) => (
    <MockView>
      <MockText>{personAName}</MockText>
      <MockText>{personBName}</MockText>
      <MockTouchableOpacity testID="btn-delete-restriction" onPress={onPress} />
    </MockView>
  ),
}));

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
    blockDependentDraw: false,
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
    expect(getByText("Impedir que titulares e dependentes se tirem no sorteio")).toBeTruthy();
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
    const { getByRole } = render(<PartyDrawRestrictionsScreen />);
    
    const toggleSwitch = getByRole('switch');
    fireEvent(toggleSwitch, 'valueChange', true);

    expect(defaultViewModelMock.handleToggleBlockDependentDraw).toHaveBeenCalledWith(true);
  });

  it("deve exibir o aviso se blockDependentDraw for true", () => {
    mockUsePartyDrawRestrictionsViewModel.mockReturnValue({
      ...defaultViewModelMock,
      blockDependentDraw: true,
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
      },
    ];

    mockUsePartyDrawRestrictionsViewModel.mockReturnValue({
      ...defaultViewModelMock,
      restrictionsList: mockList,
    });

    const { getByText, getByTestId } = render(<PartyDrawRestrictionsScreen />);

    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Bob")).toBeTruthy();

    const deleteButton = getByTestId("btn-delete-restriction");
    fireEvent.press(deleteButton);

    expect(defaultViewModelMock.handleDeleteRestriction).toHaveBeenCalledWith("id-regra-1");
  });
});