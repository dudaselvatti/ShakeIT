import React from "react";
import { render, fireEvent, renderHook, act } from "@testing-library/react-native";
import { GestaoDependentesScreen } from "./index";
import { useGestaoDependentesViewModel } from "./GestaoDependentesViewModel";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { getDependentsByUser, deleteDependentFromCloud } from "../../services/cloud/Dependent/DependentDb";
import { getOrCreateWishlist } from "../../services/cloud/Wishlist/WishlistDb";

jest.mock("./GestaoDependentesViewModel", () => ({
    useGestaoDependentesViewModel: jest.fn(),
}));

jest.mock("../../services/cloud/Wishlist/WishlistDb", () => ({
    getOrCreateWishlist: jest.fn(),
}));

jest.mock("../../contexts/AuthContext/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../services/cloud/Dependent/DependentDb", () => ({
    getDependentsByUser: jest.fn(),
    deleteDependentFromCloud: jest.fn(),
}));

jest.mock("../../components/AppHeader", () => {
    const ReactNative = jest.requireActual("react-native");
    return {
        AppHeader: ({ headerTitle }: any) => (
            <ReactNative.View testID="app-header">
                <ReactNative.Text>{headerTitle}</ReactNative.Text>
            </ReactNative.View>
        ),
    };
});

jest.mock("../../components/AppFooter", () => {
    const ReactNative = jest.requireActual("react-native");
    return {
        AppFooter: () => <ReactNative.View testID="app-footer" />,
    };
});

jest.mock("../../components/PopupModal", () => {
    const ReactNative = jest.requireActual("react-native");
    return {
        PopupModal: ({ visible, onCancel, onConfirm, message }: any) => visible ? (
            <ReactNative.View testID="confirmation-modal">
                <ReactNative.Text>{message}</ReactNative.Text>
                <ReactNative.Pressable onPress={onCancel} testID="btn-cancel">
                    <ReactNative.Text>Cancelar</ReactNative.Text>
                </ReactNative.Pressable>
                <ReactNative.Pressable onPress={onConfirm} testID="btn-confirm">
                    <ReactNative.Text>Confirmar</ReactNative.Text>
                </ReactNative.Pressable>
            </ReactNative.View>
        ) : null
    };
});

const mockNavigation = {
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
};

const mockUsuario = {
    id: "user-id-123",
    nome: "Tester",
    email: "tester@email.com",
};

const mockDependentes = [
    {
        id: "dep-1",
        user_id: "user-id-123",
        name: "Bolinha",
        dependent_type: "pet" as const,
        birth_date: "2021-06-01",
        gender: "Macho",
        avatar_url: "",
        created_at: "",
        updated_at: "",
    },
    {
        id: "dep-2",
        user_id: "user-id-123",
        name: "Luluzinha",
        dependent_type: "child" as const,
        birth_date: "2015-08-10",
        gender: "Feminino",
        avatar_url: "",
        created_at: "",
        updated_at: "",
    },
];

const baseViewModelMock = {
    dependents: mockDependentes,
    isLoading: false,
    errorMessage: "",
    successMessage: "",
    dependentToDelete: null,
    handleAddDependent: jest.fn(),
    handleEditDependent: jest.fn(),
    confirmDeleteDependent: jest.fn(),
    cancelDelete: jest.fn(),
    executeDelete: jest.fn(),
    clearMessages: jest.fn(),
    loadDependents: jest.fn(),
};

describe("GestaoDependentes - Screen e ViewModel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        (useAuth as jest.Mock).mockReturnValue({
            usuarioAtual: mockUsuario,
        });

        (getDependentsByUser as jest.Mock).mockImplementation(() => Promise.resolve(mockDependentes));

        (getOrCreateWishlist as jest.Mock).mockResolvedValue({
            likes_tags: [],
            avoids_tags: [],
        });
        
        const actualHook = jest.requireActual("./GestaoDependentesViewModel").useGestaoDependentesViewModel;
        (useGestaoDependentesViewModel as jest.Mock).mockImplementation(actualHook);
    });

    describe("ViewModel", () => {
        it("deve carregar dependentes do usuario atual", async () => {
            const { result } = renderHook(() => useGestaoDependentesViewModel(mockNavigation));

            await act(async () => {
                await result.current.loadDependents();
            });

            expect(getDependentsByUser).toHaveBeenCalledWith("user-id-123");
            expect(result.current.dependents).toEqual([
                {
                    ...mockDependentes[0],
                    gostos: [],
                    evitar: [],
                },
                {
                    ...mockDependentes[1],
                    gostos: [],
                    evitar: [],
                },
            ]);
            expect(result.current.isLoading).toBe(false);
        });
        
        it("deve navegar para cadastrar dependente", () => {
            const { result } = renderHook(() => useGestaoDependentesViewModel(mockNavigation));

            act(() => {
                result.current.handleAddDependent();
            });

            expect(mockNavigation.navigate).toHaveBeenCalledWith("FormDependente");
        });

        it("deve navegar para editar dependente com parametros", () => {
            const { result } = renderHook(() => useGestaoDependentesViewModel(mockNavigation));

            act(() => {
                result.current.handleEditDependent(mockDependentes[0]);
            });

            expect(mockNavigation.navigate).toHaveBeenCalledWith("FormDependente", { dependent: mockDependentes[0] });
        });

        it("deve gerenciar fluxo de exclusão de dependente", async () => {
            (deleteDependentFromCloud as jest.Mock).mockResolvedValue(undefined);
            const { result } = renderHook(() => useGestaoDependentesViewModel(mockNavigation));

            await act(async () => {
                await result.current.loadDependents();
            });

            act(() => {
                result.current.confirmDeleteDependent("dep-1");
            });

            expect(result.current.dependentToDelete).toBe("dep-1");

            await act(async () => {
                await result.current.executeDelete();
            });

            expect(deleteDependentFromCloud).toHaveBeenCalledWith("dep-1");
            expect(result.current.successMessage).toBe("Dependente excluído com sucesso!");
            expect(result.current.dependentToDelete).toBeNull();
        });
    });

    describe("Screen", () => {
        it("deve renderizar a listagem e os cards dos dependentes", async () => {
            (useGestaoDependentesViewModel as jest.Mock).mockReturnValue({
                ...baseViewModelMock,
                dependents: mockDependentes,
            });

            const { getByText } = render(<GestaoDependentesScreen navigation={mockNavigation} />);

            expect(getByText("Bolinha")).toBeTruthy();
            expect(getByText("Luluzinha")).toBeTruthy();
            expect(getByText(/Gerenciar Dependentes/i)).toBeTruthy();
            expect(getByText(/Filho\(a\)/i)).toBeTruthy();
            expect(getByText(/Pet/i)).toBeTruthy();
        });

        it("deve renderizar tela vazia se nao houver dependentes", async () => {
            (useGestaoDependentesViewModel as jest.Mock).mockReturnValue({
                ...baseViewModelMock,
                dependents: [],
            });
            
            const { getByTestId } = render(<GestaoDependentesScreen navigation={mockNavigation} />);

            expect(getByTestId("empty-state")).toBeTruthy();
        });

        it("deve disparar exclusão ao confirmar modal", async () => {
            const mockConfirmDeleteDependent = jest.fn();
            const mockExecuteDelete = jest.fn();

            (useGestaoDependentesViewModel as jest.Mock).mockReturnValue({
                ...baseViewModelMock,
                dependentToDelete: "dep-1",
                confirmDeleteDependent: mockConfirmDeleteDependent,
                executeDelete: mockExecuteDelete,
            });

            const { getByTestId } = render(<GestaoDependentesScreen navigation={mockNavigation} />);

            expect(getByTestId("confirmation-modal")).toBeTruthy();

            const confirmBtn = getByTestId("btn-confirm");
            
            act(() => {
                fireEvent.press(confirmBtn);
            });

            expect(mockExecuteDelete).toHaveBeenCalled();
        });
    });
});