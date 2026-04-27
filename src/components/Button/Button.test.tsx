import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "./index";

describe("Componente: Button", () => {
  it("deve renderizar o título e disparar a ação de clique", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Testar Botão" onPress={onPressMock} />,
    );

    const buttonElement = getByText("Testar Botão");
    expect(buttonElement).toBeTruthy();

    fireEvent.press(buttonElement);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
