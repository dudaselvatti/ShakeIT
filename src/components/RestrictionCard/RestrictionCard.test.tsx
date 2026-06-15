import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { RestrictionCard } from "./index";
import { useRestrictionCardViewModel } from "./RestrictionCardViewModel";

jest.mock("./RestrictionCardViewModel", () => ({
  useRestrictionCardViewModel: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

describe("RestrictionCard Component", () => {
  const mockOnPress = jest.fn();
  
  // 1. Define all required props here
  const mockProps = {
    id: "123",
    personAName: "Alice",
    personBName: "Bob",
    restrictionDirection: "one_way" as const,
    onPress: mockOnPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRestrictionCardViewModel as jest.Mock).mockReturnValue(mockProps);
  });

  it("deve renderizar os nomes das pessoas corretamente", () => {
    const { getByText } = render(<RestrictionCard {...mockProps} />);

    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Bob")).toBeTruthy();
  });

  it("deve renderizar apenas a seta para a direita quando a restrição for unidirecional ('one_way')", () => {
    const { UNSAFE_getAllByType } = render(<RestrictionCard {...mockProps} />);

    const icons = UNSAFE_getAllByType("Feather");
    const iconNames = icons.map(icon => icon.props.name);

    expect(iconNames).toContain("arrow-right");
    expect(iconNames).not.toContain("arrow-left");
    expect(iconNames).toContain("x");
  });

  it("deve renderizar ambas as setas quando a restrição for para os dois lados ('both_ways')", () => {
    (useRestrictionCardViewModel as jest.Mock).mockReturnValue({
      ...mockProps,
      restrictionDirection: "both_ways",
    });

    const { UNSAFE_getAllByType } = render(<RestrictionCard {...mockProps} />);

    const icons = UNSAFE_getAllByType("Feather");
    const iconNames = icons.map(icon => icon.props.name);

    expect(iconNames).toContain("arrow-right");
    expect(iconNames).toContain("arrow-left");
  });

  it("deve chamar a função onPress ao clicar no botão de fechar (X)", () => {
    const { getByTestId } = render(<RestrictionCard {...mockProps} />);

    const closeButton = getByTestId("close-button");
    fireEvent.press(closeButton);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("deve passar as propriedades corretamente para o useRestrictionCardViewModel", () => {
    render(<RestrictionCard {...mockProps} />);
    
    expect(useRestrictionCardViewModel).toHaveBeenCalledWith(mockProps);
  });
});