import {
    getDependentsByUser,
    storeDependentInCloud,
    updateDependentInCloud,
    deleteDependentFromCloud,
} from "./DependentDb";
import { doc, setDoc, getDocs, query, where, updateDoc, deleteDoc } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    doc: jest.fn(() => ({ id: "mocked_dependent_id" })),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    Timestamp: {
        fromDate: jest.fn((date) => ({ toDate: () => date, mockTimestamp: true })),
    },
}));

jest.mock("../../../config/firebase", () => ({
    db: {},
}));

describe("DependentDb - Testes Unitários", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers().setSystemTime(new Date("2026-06-08T10:00:00.000Z"));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("getDependentsByUser", () => {
        it("deve retornar a lista de dependentes mapeada", async () => {
            const mockDocs = [
                {
                    id: "dep1",
                    data: () => ({
                        user_id: "user123",
                        name: "Rex",
                        dependent_type: "pet",
                        birth_date: { toDate: () => new Date("2020-01-01T12:00:00.000Z") },
                        gender: "Macho",
                    }),
                },
            ];

            const mockQuerySnapshot = {
                forEach: (callback: any) => mockDocs.forEach(callback),
            };

            (getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot);

            const result = await getDependentsByUser("user123");

            expect(query).toHaveBeenCalled();
            expect(where).toHaveBeenCalledWith("user_id", "==", "user123");
            expect(getDocs).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("dep1");
            expect(result[0].birth_date).toBe("2020-01-01");
            expect(result[0].gender).toBe("Macho");
        });
    });

    describe("storeDependentInCloud", () => {
        it("deve criar um novo dependente com novo ID se não fornecido", async () => {
            const mockDependent = {
                user_id: "user123",
                name: "Clara",
                dependent_type: "child" as const,
                birth_date: "2018-05-15",
                gender: "Feminino",
                avatar_url: "avatar.jpg",
            };

            const result = await storeDependentInCloud(mockDependent);

            expect(doc).toHaveBeenCalled();
            expect(setDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    id: "mocked_dependent_id",
                    user_id: "user123",
                    name: "Clara",
                    created_at: "2026-06-08T10:00:00.000Z",
                    updated_at: "2026-06-08T10:00:00.000Z",
                })
            );

            expect(result.id).toBe("mocked_dependent_id");
            expect(result.created_at).toBe("2026-06-08T10:00:00.000Z");
        });
    });

    describe("updateDependentInCloud", () => {
        it("deve atualizar os dados do dependente no Firestore", async () => {
            await updateDependentInCloud("dep123", { name: "Rex Novo", birth_date: "2021-02-02" });

            expect(updateDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    name: "Rex Novo",
                    updated_at: "2026-06-08T10:00:00.000Z",
                })
            );
        });
    });

    describe("deleteDependentFromCloud", () => {
        it("deve remover o dependente do Firestore", async () => {
            await deleteDependentFromCloud("dep123");

            expect(deleteDoc).toHaveBeenCalled();
        });
    });
});
