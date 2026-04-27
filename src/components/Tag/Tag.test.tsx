import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Tag } from "./index";

describe("Componente: Tag", () => {
  it("deve renderizar o texto corretamente", () => {
    const { getByText } = render(<Tag label="Games" />);
    expect(getByText("Games")).toBeTruthy();
  });

  it("NÃO deve exibir o botão de fechar se onRemove não for passado", () => {
    const { queryByLabelText } = render(<Tag label="Leitura" />);
    const closeButton = queryByLabelText("Remover tag");
    expect(closeButton).toBeNull();
  });

  it("deve exibir o botão e disparar a função se onRemove for passado", () => {
    const onRemoveMock = jest.fn();
    const { getByLabelText } = render(
      <Tag label="Games" onRemove={onRemoveMock} />,
    );

    const closeButton = getByLabelText("Remover tag");
    expect(closeButton).toBeTruthy();

    fireEvent.press(closeButton);
    expect(onRemoveMock).toHaveBeenCalledTimes(1);
  });
});
