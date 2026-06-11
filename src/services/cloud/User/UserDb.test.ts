import {
    seedUsers,
    getUserById,
    getUsersFromCloud,
    storeUserInCloud,
    userLogin,
    resetUserPassword,
    userLogout
} from "./UserDb";
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import { usuariosMock } from "../../../mocks/usuariosMock";

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    doc: jest.fn(() => ({ id: "mocked_doc_ref" })),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    Timestamp: {
        fromDate: jest.fn((date) => ({ toDate: () => date, mockTimestamp: true })),
    },
}));

jest.mock("firebase/auth", () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
}));

jest.mock("../../../config/firebase", () => ({
    auth: {},
    storage: {},
    db: {},
}));

jest.mock("../../../mocks/usuariosMock", () => ({
    usuariosMock: [
        { id: "user1", nome: "Mock Um" },
        { id: "user2", nome: "Mock Dois" }
    ]
}));

const mockXHR = {
    open: jest.fn(),
    send: jest.fn(function(this: any) {
        if (this.onload) this.onload();
    }),
    response: new Blob(),
    onload: null as any,
    onerror: null as any,
    responseType: "",
};
(global as any).XMLHttpRequest = jest.fn(() => mockXHR);

describe("UserDb - Testes Unitários", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers().setSystemTime(new Date("2026-06-08T10:00:00.000Z"));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("seedUsers", () => {
        it("deve popular o banco se a collection estiver vazia", async () => {
            (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

            await seedUsers();

            expect(getDocs).toHaveBeenCalled();
            expect(setDoc).toHaveBeenCalledTimes(usuariosMock.length);
            expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", usuariosMock[0].id);
        });

        it("não deve popular o banco se a collection já possuir dados", async () => {
            (getDocs as jest.Mock).mockResolvedValueOnce({ empty: false });

            await seedUsers();

            expect(setDoc).not.toHaveBeenCalled();
        });
    });

    describe("getUserById", () => {
        it("deve retornar o usuário se o documento existir", async () => {
            const mockUser = { id: "123", nome: "Lucas" };
            const mockDocSnap = {
                exists: () => true,
                data: () => mockUser
            };
            (getDoc as jest.Mock).mockResolvedValueOnce(mockDocSnap);

            const result = await getUserById("123");

            expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", "123");
            expect(result).toEqual(mockUser);
        });

        it("deve retornar null se o documento não existir", async () => {
            const mockDocSnap = { exists: () => false };
            (getDoc as jest.Mock).mockResolvedValueOnce(mockDocSnap);

            const result = await getUserById("999");

            expect(result).toBeNull();
        });
    });

    describe("getUsersFromCloud", () => {
        it("deve retornar uma lista com todos os usuários do banco", async () => {
            const mockDocs = [
                { data: () => ({ id: "1", nome: "User 1" }) },
                { data: () => ({ id: "2", nome: "User 2" }) }
            ];
            const mockQuerySnapshot = {
                forEach: (callback: any) => mockDocs.forEach(callback)
            };
            (getDocs as jest.Mock).mockResolvedValueOnce(mockQuerySnapshot);

            const result = await getUsersFromCloud();

            expect(collection).toHaveBeenCalledWith(expect.any(Object), "users");
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe("1");
        });
    });

    describe("storeUserInCloud", () => {
        const mockDto = {
            email: "teste@email.com ",
            senha: "password123",
            nome: " Teste Silva ",
            genero: "Masculino",
            birth_date: new Date("1995-05-05"),
            bio: "Minha bio de teste",
            sizes: { camisa: "G" },
            avatar_url: "https://site.com/foto.jpg"
        };

        it("deve cadastrar o usuário no Auth, fazer upload do avatar e salvar dados tratados no Firestore", async () => {
            const mockUserCredential = { user: { uid: "auth_uid_123", email: "teste@email.com" } };
            (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(mockUserCredential);

            (global as any).XMLHttpRequest.mockClear();
            mockXHR.open.mockClear();
            mockXHR.send.mockImplementation(function(this: any) {
                if (this.onload) this.onload();
            });
            (uploadBytes as jest.Mock).mockResolvedValueOnce({});
            (getDownloadURL as jest.Mock).mockResolvedValueOnce("https://firebasestorage/avatar_url_final.jpg");

            const result = await storeUserInCloud(mockDto);

            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), mockDto.email, mockDto.senha);

            expect((global as any).XMLHttpRequest).toHaveBeenCalled();
            expect(mockXHR.open).toHaveBeenCalledWith("GET", mockDto.avatar_url, true);
            expect(uploadBytes).toHaveBeenCalled();
            expect(getDownloadURL).toHaveBeenCalled();

            expect(setDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    id: "auth_uid_123",
                    email: "teste@email.com",
                    nome: "Teste Silva",
                    avatar_url: "https://firebasestorage/avatar_url_final.jpg",
                    created_at: "2026-06-08T10:00:00.000Z",
                    updated_at: "2026-06-08T10:00:00.000Z",
                    shake_enabled: true
                })
            );

            expect(result).toEqual(mockUserCredential.user);
        });

        it("deve usar a foto padrão se o upload da imagem falhar", async () => {
            const mockUserCredential = { user: { uid: "auth_uid_123" } };
            (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(mockUserCredential);
            
            mockXHR.send.mockImplementation(function(this: any) {
                if (this.onerror) this.onerror(new Error("Network Error"));
            });

            await storeUserInCloud(mockDto);

            expect(setDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    avatar_url: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                })
            );
        });
    });

    describe("Autenticação Básica (Login, Logout, Reset)", () => {
        it("deve invocar signInWithEmailAndPassword corretamente", async () => {
            const loginDto = { email: " login@teste.com ", senha: "123" };
            (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: { uid: "1" } });

            await userLogin(loginDto);

            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), "login@teste.com", "123");
        });

        it("deve invocar sendPasswordResetEmail corretamente", async () => {
            const resetDto = { email: " reset@teste.com " };
            (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined);

            await resetUserPassword(resetDto);

            expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.any(Object), "reset@teste.com");
        });

        it("deve invocar signOut corretamente", async () => {
            (signOut as jest.Mock).mockResolvedValueOnce(undefined);

            await userLogout();

            expect(signOut).toHaveBeenCalled();
        });
    });
});