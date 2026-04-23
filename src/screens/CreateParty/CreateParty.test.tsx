import React from "react";
import { render } from "@testing-library/react-native";
import { CreatePartyScreen } from "./index";

describe("Tela: CreateParty", () => {
  it("deve renderizar o título temporário", () => {
    const { getByText } = render(
      <CreatePartyScreen navigation={{ goBack: jest.fn() }} />,
    );
    expect(getByText("Tela 3")).toBeTruthy();
  });
});
