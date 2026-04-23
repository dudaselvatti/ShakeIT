import React from "react";
import { render } from "@testing-library/react-native";
import { HomeScreen } from "./index";

const mockedNavigate = jest.fn();

describe("Tela: Home", () => {
  it("deve renderizar a saudação inicial", () => {
    const { getByText } = render(
      <HomeScreen navigation={{ navigate: mockedNavigate }} />,
    );
    expect(getByText(/Olá, Duda/i)).toBeTruthy();
  });
});
