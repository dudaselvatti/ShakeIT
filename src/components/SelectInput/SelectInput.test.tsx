import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SelectInput } from "./index";
import { useSelectInputViewModel } from "./SelectInputViewModel";
import { View } from "react-native";

jest.mock("./SelectInputViewModel", () => ({
  useSelectInputViewModel: jest.fn(),
}));

function MockPickerContainer({
  children,
  selectedValue,
  onValueChange,
  ...props
}: any) {
  return (
    <View testID="mock-picker" {...props}>
      {React.Children.map(children, (child: any) =>
        child
          ? React.cloneElement(child, {
              onValueChange,
              isSelected: child.props.value === selectedValue,
            })
          : null
      )}
    </View>
  );
}

function MockPickerItem({
  label,
  value,
  onValueChange,
}: any) {
  return (
    <View
      testID={`picker-item-${value}`}
      onClick={() => onValueChange?.(value)}
      accessibilityLabel={label}
    />
  );
}

jest.mock("@react-native-picker/picker", () => ({
  Picker: Object.assign(MockPickerContainer, {
    Item: MockPickerItem,
  }),
}));

describe("SelectInput Component", () => {
  const mockOnValueChange = jest.fn();
  const defaultProps = {
    label: "Selecione o idioma",
    options: ["TypeScript", "JavaScript", "Python"],
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
      options: ["TypeScript", "JavaScript", "Python"],
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
      options: ["TypeScript"],
    });

    const { getByTestId } = render(<SelectInput {...defaultProps} />);
    
    const picker = getByTestId("mock-picker");
    fireEvent(picker, "valueChange", "TypeScript");

    expect(mockOnValueChange).toHaveBeenCalledWith("TypeScript");
  });
});