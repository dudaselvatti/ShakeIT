import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { WelcomeScreen } from "./index";
import * as WelcomeViewModelModule from "./WelcomeViewModel";

jest.mock("./WelcomeViewModel", () => ({
    useWelcomeViewModel: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
    Feather: "Feather",
}));

describe("WelcomeScreen", () => {
    const mockHandleLogin = jest.fn();
    const mockHandleRegister = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(WelcomeViewModelModule, "useWelcomeViewModel").mockReturnValue({
            handleLogin: mockHandleLogin,
            handleRegister: mockHandleRegister,
        });
    });

    it("deve renderizar os elementos da tela de boas vindas", () => {
        const { getByText } = render(<WelcomeScreen />);
        expect(getByText("Bem vindo ao ShakeIT")).toBeTruthy();
        expect(getByText("A forma mais fácil e divertida de organizar sorteios e compartilhar suas listas de desejos com amigos e familiares!")).toBeTruthy();
        expect(getByText("Criar uma conta")).toBeTruthy();
        expect(getByText("Já tenho uma conta")).toBeTruthy();
    });

    it("deve chamar handleRegister ao clicar em 'Criar uma conta'", () => {
        const { getByText } = render(<WelcomeScreen />);
        fireEvent.press(getByText("Criar uma conta"));
        expect(mockHandleRegister).toHaveBeenCalled();
    });

    it("deve chamar handleLogin ao clicar em 'Já tenho uma conta'", () => {
        const { getByText } = render(<WelcomeScreen />);
        fireEvent.press(getByText("Já tenho uma conta"));
        expect(mockHandleLogin).toHaveBeenCalled();
    });
});
