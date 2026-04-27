import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { Card } from "./index";

describe("Componente: Card", () => {
  it("deve renderizar o conteúdo interno (children) corretamente", () => {
    const { getByText } = render(
      <Card>
        <Text>Festa da Firma</Text>
      </Card>,
    );
    expect(getByText("Festa da Firma")).toBeTruthy();
  });
});
