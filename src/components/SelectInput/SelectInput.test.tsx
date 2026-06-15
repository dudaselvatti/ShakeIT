import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SelectInput } from "./index";
import { useSelectInputViewModel } from "./SelectInputViewModel";

jest.mock("./SelectInputViewModel", () => ({
  useSelectInputViewModel: jest.fn(),
}));

jest.mock('@react-native-picker/picker', () => {
  const React = jest.requireActual('react');

  const MockPicker = ({ children, ...props }: any) => {
    return React.createElement('View', { testID: 'mock-picker', ...props }, children);
  };

  const MockPickerItem = ({ label, value, testID }: any) => {
    return React.createElement('View', { testID: testID || `picker-item-${label}`, value });
  };

  MockPicker.Item = MockPickerItem;
  return { Picker: MockPicker };
});

const options = [
  {
    key: "ts",
    label: "TypeScript",
    value: "TypeScript",
  },
  {
    key: "js",
    label: "JavaScript",
    value: "JavaScript",
  },
  {
    key: "py",
    label: "Python",
    value: "Python",
  },
];

describe("SelectInput Component", () => {
  const mockOnValueChange = jest.fn();
  const defaultProps = {
    label: "Selecione o idioma",
    options,
    selectedValue: "TypeScript",
    onValueChange: mockOnValueChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o label e as opções corretamente", () => {
    (useSelectInputViewModel as jest.Mock).mockReturnValue({
      label: "Selecione o idioma",
      selectedValue: "TypeScript",
      onValueChange: mockOnValueChange,
      options,
    });

    const { getByText, getByTestId } = render(<SelectInput {...defaultProps} />);

    expect(getByText("Selecione o idioma")).toBeTruthy();
    expect(getByTestId("picker-item-TypeScript")).toBeTruthy();
    expect(getByTestId("picker-item-JavaScript")).toBeTruthy();
    expect(getByTestId("picker-item-Python")).toBeTruthy();
  });

  it("deve chamar a função onValueChange quando uma nova opção for selecionada", () => {
    (useSelectInputViewModel as jest.Mock).mockReturnValue({
      label: "Selecione o idioma",
      selectedValue: "",
      onValueChange: mockOnValueChange,
      options,
    });

    const { getByTestId } = render(<SelectInput {...defaultProps} />);
    
    const picker = getByTestId("mock-picker");
    fireEvent(picker, "valueChange", "TypeScript");

    expect(mockOnValueChange).toHaveBeenCalledWith("TypeScript");
  });
});