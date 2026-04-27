import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { IconButton } from "./index";

describe("Componente: IconButton", () => {
  it("deve renderizar corretamente e disparar o evento de clique", () => {
    const onPressMock = jest.fn();

    const { getByTestId } = render(
      <IconButton iconName="plus" onPress={onPressMock} testID="icon-button" />,
    );

    const button = getByTestId("icon-button");
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
