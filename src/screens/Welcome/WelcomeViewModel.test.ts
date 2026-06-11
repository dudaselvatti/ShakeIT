import { renderHook, act } from "@testing-library/react-native";
import { useWelcomeViewModel } from "./WelcomeViewModel";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
    useNavigation: jest.fn(),
}));

describe("WelcomeViewModel", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({
            navigate: mockNavigate,
        });
    });

    it("deve navegar para a tela de Login", () => {
        const { result } = renderHook(() => useWelcomeViewModel());
        act(() => {
            result.current.handleLogin();
        });
        expect(mockNavigate).toHaveBeenCalledWith("Login");
    });

    it("deve navegar para a tela de Registro", () => {
        const { result } = renderHook(() => useWelcomeViewModel());
        act(() => {
            result.current.handleRegister();
        });
        expect(mockNavigate).toHaveBeenCalledWith("Registration");
    });
});
