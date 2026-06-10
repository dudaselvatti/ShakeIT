import React from "react";
import { render, fireEvent, renderHook, act } from "@testing-library/react-native";
import { FormDependenteScreen } from "./index";
import { useFormDependenteViewModel } from "./FormDependenteViewModel";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { storeDependentInCloud } from "../../services/cloud/Dependent/DependentDb";
import { useRoute } from "@react-navigation/native";

jest.mock("../../contexts/AuthContext/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../services/cloud/Dependent/DependentDb", () => ({
    storeDependentInCloud: jest.fn(),
    updateDependentInCloud: jest.fn(),
}));

jest.mock("@react-navigation/native", () => {
    const originalModule = jest.requireActual("@react-navigation/native");
    return {
        ...originalModule,
        useRoute: jest.fn(),
    };
});

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

jest.mock("../../components/DateInput", () => {
    const ReactNative = jest.requireActual("react-native");
    return {
        DateInput: ({ label, value, onChangeDate, testID }: any) => (
            <ReactNative.View testID={testID}>
                <ReactNative.Text>{label}</ReactNative.Text>
                <ReactNative.Pressable
                    testID="btn-trigger-date"
                    onPress={() => onChangeDate(new Date("2021-06-01T12:00:00"))}
                >
                    <ReactNative.Text>Definir Data</ReactNative.Text>
                </ReactNative.Pressable>
            </ReactNative.View>
        ),
    };
});

jest.mock("../../components/SelectInput", () => {
    const ReactNative = jest.requireActual("react-native");
    return {
        SelectInput: ({ label, selectedValue, onValueChange, options, testID }: any) => (
            <ReactNative.View testID={testID}>
                <ReactNative.Text>{label}</ReactNative.Text>
                <ReactNative.Text testID="selected-value-display">{selectedValue}</ReactNative.Text>
                {options.map((opt: string) => (
                    <ReactNative.Pressable
                        key={opt}
                        testID={`select-option-${opt}`}
                        onPress={() => onValueChange(opt)}
                    >
                        <ReactNative.Text>{opt}</ReactNative.Text>
                    </ReactNative.Pressable>
                ))}
            </ReactNative.View>
        ),
    };
});

const mockNavigation = {
    goBack: jest.fn(),
};

const mockUsuario = {
    id: "user-123",
    nome: "Tester",
    email: "tester@email.com",
};

describe("FormDependente - Screen e ViewModel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            usuarioAtual: mockUsuario,
        });
        (useRoute as jest.Mock).mockReturnValue({
            params: {},
        });
    });

    describe("ViewModel", () => {
        it("deve iniciar com campos vazios no cadastro", () => {
            const { result } = renderHook(() => useFormDependenteViewModel(mockNavigation));

            expect(result.current.name).toBe("");
            expect(result.current.dependentType).toBe("");
            expect(result.current.birthDate).toBeUndefined();
            expect(result.current.gender).toBe("");
            expect(result.current.relationship).toBe("");
        });

        it("deve carregar dados no modo edição", () => {
            const mockDependent = {
                id: "dep-1",
                user_id: "user-123",
                name: "Floquinho",
                dependent_type: "pet" as const,
                birth_date: "2020-05-10",
                gender: "Macho",
                avatar_url: "floquinho.jpg",
                bio: "Muito brincalhão",
                relationship: "Meu cãozinho",
            };

            const { result } = renderHook(() => useFormDependenteViewModel(mockNavigation, mockDependent));

            expect(result.current.name).toBe("Floquinho");
            expect(result.current.dependentType).toBe("pet");
            expect(result.current.gender).toBe("Macho");
            expect(result.current.bio).toBe("Muito brincalhão");
            expect(result.current.avatarUrl).toBe("floquinho.jpg");
            expect(result.current.relationship).toBe("Meu cãozinho");
            expect(result.current.birthDate).toEqual(new Date(2020, 4, 10, 12, 0, 0));
        });

        it("deve disparar erro de validação se tentar salvar formulário vazio", async () => {
            const { result } = renderHook(() => useFormDependenteViewModel(mockNavigation));

            await act(async () => {
                await result.current.handleSave();
            });

            expect(result.current.errors.name).toBe("O nome é obrigatório.");
            expect(result.current.errors.dependentType).toBe("O tipo de dependente é obrigatório.");
            expect(result.current.errors.birthDate).toBe("A data de nascimento é obrigatória.");
            expect(result.current.errors.relationship).toBe("");
            expect(storeDependentInCloud).not.toHaveBeenCalled();
        });

        it("deve disparar erro se tipo for Outro e relação não for preenchida", async () => {
            const { result } = renderHook(() => useFormDependenteViewModel(mockNavigation));

            act(() => {
                result.current.updateName("Tio João");
                result.current.updateDependentType("other");
                result.current.updateBirthDate(new Date(2000, 1, 1));
            });

            await act(async () => {
                await result.current.handleSave();
            });

            expect(result.current.errors.relationship).toBe("A relação é obrigatória para o tipo Outro.");
            expect(storeDependentInCloud).not.toHaveBeenCalled();
        });

        it("deve salvar dependente com sucesso se os dados forem validos", async () => {
            (storeDependentInCloud as jest.Mock).mockResolvedValue({ id: "new-dep" });
            const { result } = renderHook(() => useFormDependenteViewModel(mockNavigation));

            act(() => {
                result.current.updateName("Bolinha");
                result.current.updateDependentType("pet");
                result.current.updateBirthDate(new Date(2022, 1, 15));
                result.current.updateGender("Fêmea");
                result.current.setBio("Gosta de sachê");
            });

            await act(async () => {
                await result.current.handleSave();
            });

            expect(storeDependentInCloud).toHaveBeenCalledWith({
                user_id: "user-123",
                name: "Bolinha",
                dependent_type: "pet",
                birth_date: "2022-02-15",
                gender: "Fêmea",
                bio: "Gosta de sachê",
                avatar_url: "https://i.pravatar.cc/150?img=10",
                relationship: undefined,
            });
            expect(mockNavigation.goBack).toHaveBeenCalled();
        });
    });

    describe("Screen - Validação de data de nascimento de pet", () => {
        it("deve exibir erro UI ao tentar cadastrar pet sem data de nascimento", async () => {
            const { getByTestId } = render(
                <FormDependenteScreen navigation={mockNavigation} />
            );

            // Preenche os outros campos obrigatórios: Nome, Tipo (Pet)
            const inputNome = getByTestId("input-nome");
            fireEvent.changeText(inputNome, "Spyke");

            // Clica na opção "Pet" no SelectInput mockado
            const optionPet = getByTestId("select-option-Pet");
            fireEvent.press(optionPet);

            // Verifica que a data de nascimento está vazia e tenta salvar
            const saveBtn = getByTestId("btn-salvar");
            await act(async () => {
                fireEvent.press(saveBtn);
            });

            // O erro de data de nascimento deve aparecer na UI
            const dateErrorText = getByTestId("birth-date-error");
            expect(dateErrorText).toBeTruthy();
            expect(dateErrorText.props.children).toBe("A data de nascimento é obrigatória.");

            // Verifica que a gravação não foi executada
            expect(storeDependentInCloud).not.toHaveBeenCalled();
        });
    });

    describe("Screen - Seletor de Gênero com Customização", () => {
        it("deve renderizar o input de gênero customizado ao selecionar Outros", () => {
            const { getByTestId, queryByTestId } = render(
                <FormDependenteScreen navigation={mockNavigation} />
            );

            // Inicialmente o input customizado não deve estar visível
            expect(queryByTestId("input-genero-custom")).toBeNull();

            // Clica na opção "Outros" no SelectInput de Gênero
            const optionOutros = getByTestId("select-option-Outros");
            fireEvent.press(optionOutros);

            // Agora o input customizado deve aparecer
            expect(getByTestId("input-genero-custom")).toBeTruthy();
        });
    });
});
