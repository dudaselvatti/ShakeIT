import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PopupModal } from "./index";

describe("Componente: PopupModal", () => {
  it("deve renderizar título e mensagem e disparar os callbacks ao clicar", () => {
    const onCancelMock = jest.fn();
    const onConfirmMock = jest.fn();

    const { getByText } = render(
      <PopupModal
        visible={true}
        title="Atenção"
        message="A party não será salva."
        onCancel={onCancelMock}
        onConfirm={onConfirmMock}
      />,
    );

    expect(getByText("Atenção")).toBeTruthy();
    expect(getByText("A party não será salva.")).toBeTruthy();

    fireEvent.press(getByText("Cancelar"));
    expect(onCancelMock).toHaveBeenCalledTimes(1);

    fireEvent.press(getByText("OK"));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });
});
