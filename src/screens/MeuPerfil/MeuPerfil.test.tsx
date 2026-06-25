import React from 'react';
import { render, fireEvent, renderHook, act } from '@testing-library/react-native';
import { MeuPerfilScreen } from './index';
import { useMeuPerfilViewModel } from './MeuPerfilViewModel';
import * as MeuPerfilViewModelModule from './MeuPerfilViewModel';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { updateUsuario } from '../../services/cloud/User/UserDb';

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../services/cloud/User/UserDb', () => ({
    updateUsuario: jest.fn(),
    getUserById: jest.fn(),
    userLogout: jest.fn(),
}));

jest.mock('../../services/cloud/Wishlist/WishlistDb', () => ({
    getOrCreateWishlist: jest.fn(() => Promise.resolve({
        id: 'wishlist-id',
        likes_tags: ['Chocolate', 'Futebol'],
        avoids_tags: ['Poeira', 'Mentiras']
    })),
    addLikeTags: jest.fn(),
    removeLikeTags: jest.fn(),
    addAvoidTags: jest.fn(),
    removeAvoidTags: jest.fn(),
}));

jest.mock('../../components/AppHeader', () => {
    const ReactNative = jest.requireActual('react-native');
    return {
        AppHeader: ({ headerTitle }: any) => (
            <ReactNative.View testID="app-header">
                <ReactNative.Text>{headerTitle}</ReactNative.Text>
            </ReactNative.View>
        ),
    };
});

jest.mock('../../components/AppFooter', () => {
    const ReactNative = jest.requireActual('react-native');
    return {
        AppFooter: () => <ReactNative.View testID="app-footer" />,
    };
});

jest.mock('../../components/PopupModal', () => {
    const ReactNative = jest.requireActual('react-native');
    return {
        PopupModal: ({ visible, onConfirm, onCancel, message, title, testID }: any) => visible ? (
            <ReactNative.View testID={testID || "popup-modal"}>
                <ReactNative.Text testID={title === "Sucesso!" ? "success-message" : "error-message"}>{message}</ReactNative.Text>
                <ReactNative.Pressable onPress={onConfirm || onCancel} testID={title === "Sucesso!" ? "success-toast" : "error-toast"}>
                    <ReactNative.Text>Fechar</ReactNative.Text>
                </ReactNative.Pressable>
            </ReactNative.View>
        ) : null
    };
});

jest.mock("@react-native-picker/picker", () => {
    const ReactNative = jest.requireActual('react-native');
    return {
        Picker: Object.assign(
            ({ children, selectedValue, onValueChange, style, testID }: any) => (
                <ReactNative.View testID={testID} selectedValue={selectedValue} onValueChange={onValueChange} style={style}>
                    {children}
                </ReactNative.View>
            ),
            { Item: ({ label, value, testID }: any) => <ReactNative.View testID={testID} label={label} value={value} /> }
        )
    };
});

jest.mock('../../components/SelectInput', () => {
    const ReactNative = jest.requireActual('react-native');
    return {
        SelectInput: ({ label, testID, onValueChange }: any) => (
            <ReactNative.View testID={testID || "mock-select-input"}>
                <ReactNative.Text>{label}</ReactNative.Text>
                <ReactNative.Button 
                    title="Mudar Valor" 
                    onPress={() => onValueChange && onValueChange('M')} 
                />
            </ReactNative.View>
        ),
    };
});

jest.mock('@expo/vector-icons', () => {
    const ReactNative = jest.requireActual('react-native');
    return {
        Feather: ({ name, size, color, testID }: any) => <ReactNative.Text testID={testID}>{name}</ReactNative.Text>,
        MaterialCommunityIcons: ({ name, size, color, testID }: any) => <ReactNative.Text testID={testID}>{name}</ReactNative.Text>,
    };
});

describe('MeuPerfilScreen e ViewModel', () => {
    const mockUpdateUsuarioAtual = jest.fn();
    const mockUpdateUsuario = updateUsuario as jest.Mock;
    const mockUseAuth = useAuth as jest.Mock;

    const mockUsuario = {
        id: 'user-id-123',
        nome: 'Tester',
        email: 'tester@email.com',
        genero: 'Outro',
        birth_date: '1990-01-01',
        avatar_url: '',
        shake_enabled: false,
        dark_mode: false,
        notifications_enabled: false,
        created_at: '',
        updated_at: '',
        bio: 'Minha biografia',
        sizes: {
            camisa: 'M',
            calca: '40',
            calcado: '39',
        },
        interesses: ['Tecnologia', 'Moda'],
        gostos: ['Chocolate', 'Futebol'],
        evitar: ['Poeira', 'Mentiras'],
    };

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    const waitForHookToLoad = async () => {
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            usuarioAtual: mockUsuario,
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: false,
        });
    });

    it('deve retornar os dados iniciais do usuario no hook useMeuPerfilViewModel', async () => {
        const { result } = renderHook(() => useMeuPerfilViewModel());

        await waitForHookToLoad();

        expect(result.current.bio).toBe('Minha biografia');
        expect(result.current.camisa).toBe('M');
        expect(result.current.calca).toBe('40');
        expect(result.current.calcado).toBe('39');
        expect(result.current.interesses).toEqual(['Tecnologia', 'Moda']);
        expect(result.current.gostos).toEqual(['Chocolate', 'Futebol']);
        expect(result.current.evitar).toEqual(['Poeira', 'Mentiras']);
    });

    it('deve lidar com usuarioAtual nulo ou sem tamanhos especificados', async () => {
        mockUseAuth.mockReturnValue({
            usuarioAtual: null,
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: true,
        });

        const { result: resultNull } = renderHook(() => useMeuPerfilViewModel());
        await waitForHookToLoad();

        expect(resultNull.current.bio).toBe('');
        expect(resultNull.current.camisa).toBe('');
        expect(resultNull.current.calca).toBe('');
        expect(resultNull.current.calcado).toBe('');
        expect(resultNull.current.interesses).toEqual([]);
        expect(resultNull.current.gostos).toEqual([]);
        expect(resultNull.current.evitar).toEqual([]);

        mockUseAuth.mockReturnValue({
            usuarioAtual: {
                ...mockUsuario,
                sizes: undefined,
                bio: undefined,
                interesses: undefined,
                gostos: undefined,
                evitar: undefined,
            },
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: false,
        });

        const { result: resultNoSizes } = renderHook(() => useMeuPerfilViewModel());
        await waitForHookToLoad();

        expect(resultNoSizes.current.bio).toBe('');
        expect(resultNoSizes.current.camisa).toBe('');
        expect(resultNoSizes.current.calca).toBe('');
        expect(resultNoSizes.current.calcado).toBe('');
        expect(resultNoSizes.current.interesses).toEqual([]);
        expect(resultNoSizes.current.gostos).toEqual(['Chocolate', 'Futebol']);
        expect(resultNoSizes.current.evitar).toEqual(['Poeira', 'Mentiras']);
    });

    it('deve atualizar os estados locais ao modificar no hook', async () => {
        const { result } = renderHook(() => useMeuPerfilViewModel());
        await waitForHookToLoad();

        act(() => {
            result.current.setBio('Nova Bio');
            result.current.setCamisa('G');
            result.current.setCalca('42');
            result.current.setCalcado('40');
            result.current.setNovoInteresse('Futebol');
            result.current.setNovoGosto('Basquete');
            result.current.setNovoEvitar('Barulho');
        });

        expect(result.current.bio).toBe('Nova Bio');
        expect(result.current.camisa).toBe('G');
        expect(result.current.calca).toBe('42');
        expect(result.current.calcado).toBe('40');
        expect(result.current.novoInteresse).toBe('Futebol');
        expect(result.current.novoGosto).toBe('Basquete');
        expect(result.current.novoEvitar).toBe('Barulho');

        act(() => {
            result.current.handleAddInteresse();
            result.current.handleAddGosto();
            result.current.handleAddEvitar();
        });

        expect(result.current.interesses).toEqual(['Tecnologia', 'Moda', 'Futebol']);
        expect(result.current.gostos).toEqual(['Chocolate', 'Futebol', 'Basquete']);
        expect(result.current.evitar).toEqual(['Poeira', 'Mentiras', 'Barulho']);

        act(() => {
            result.current.handleRemoveInteresse('Moda');
            result.current.handleRemoveGosto('Futebol');
            result.current.handleRemoveEvitar('Poeira');
        });

        expect(result.current.interesses).toEqual(['Tecnologia', 'Futebol']);
        expect(result.current.gostos).toEqual(['Chocolate', 'Basquete']);
        expect(result.current.evitar).toEqual(['Mentiras', 'Barulho']);
    });

    it('deve adicionar tags de gostos e evitar quando o usuário digita espaço e prevenir duplicatas', async () => {
        const { result } = renderHook(() => useMeuPerfilViewModel());
        await waitForHookToLoad();

        act(() => {
            result.current.setNovoGosto('Livros ');
        });
        expect(result.current.gostos).toContain('Livros');
        expect(result.current.novoGosto).toBe('');

        act(() => {
            result.current.setNovoEvitar('Frio ');
        });
        expect(result.current.evitar).toContain('Frio');
        expect(result.current.novoEvitar).toBe('');

        const totalGostos = result.current.gostos.length;
        act(() => {
            result.current.setNovoGosto('Chocolate ');
        });
        expect(result.current.gostos.length).toBe(totalGostos);
        expect(result.current.novoGosto).toBe('');

        const totalEvitar = result.current.evitar.length;
        act(() => {
            result.current.setNovoEvitar('Poeira ');
        });
        expect(result.current.evitar.length).toBe(totalEvitar);
        expect(result.current.novoEvitar).toBe('');

        act(() => {
            result.current.setNovoGosto(' ');
        });
        expect(result.current.gostos.length).toBe(totalGostos);
        expect(result.current.novoGosto).toBe('');

        act(() => {
            result.current.setNovoEvitar(' ');
        });
        expect(result.current.evitar.length).toBe(totalEvitar);
        expect(result.current.novoEvitar).toBe('');
    });

    it('deve permitir salvar apenas 1 tamanho e limpar os outros', async () => {
        mockUpdateUsuario.mockResolvedValue(undefined);
        const { result } = renderHook(() => useMeuPerfilViewModel());
        await waitForHookToLoad();

        act(() => {
            result.current.setBio('Bio editada');
            result.current.setCamisa('G');
            result.current.setCalca('');
            result.current.setCalcado('');
        });

        jest.useFakeTimers();

        await act(async () => {
            await result.current.handleSalvar();
        });

        expect(mockUpdateUsuario).toHaveBeenCalledWith('user-id-123', {
            nome: 'Tester',
            genero: 'Outro',
            birth_date: new Date('1990-01-01').toISOString(),
            avatar_url: '',
            bio: 'Bio editada',
            sizes: {
                camisa: 'G',
                calca: '',
                calcado: '',
            },
            interesses: ['Tecnologia', 'Moda'],
        });
        expect(mockUpdateUsuarioAtual).toHaveBeenCalledWith({
            nome: 'Tester',
            genero: 'Outro',
            birth_date: new Date('1990-01-01').toISOString(),
            avatar_url: '',
            bio: 'Bio editada',
            sizes: {
                camisa: 'G',
                calca: '',
                calcado: '',
            },
            interesses: ['Tecnologia', 'Moda'],
            gostos: ['Chocolate', 'Futebol'],
            evitar: ['Poeira', 'Mentiras'],
        });
        expect(result.current.successMessage).toBe('Perfil atualizado com sucesso!');

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(result.current.successMessage).toBe('');
        
        jest.useRealTimers();
    });

    it('deve definir mensagem de erro se a chamada de servico falhar', async () => {
        mockUpdateUsuario.mockRejectedValue(new Error('Erro de rede'));
        const { result } = renderHook(() => useMeuPerfilViewModel());
        await waitForHookToLoad();

        await act(async () => {
            await result.current.handleSalvar();
        });

        expect(result.current.errorMessage).toBe('Erro ao atualizar o perfil. Tente novamente.');
        expect(result.current.successMessage).toBe('');
    });

    it('nao deve fazer nada no handleSalvar se usuarioAtual for nulo', async () => {
        mockUseAuth.mockReturnValue({
            usuarioAtual: null,
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: false,
        });

        const { result } = renderHook(() => useMeuPerfilViewModel());
        await waitForHookToLoad();

        await act(async () => {
            await result.current.handleSalvar();
        });

        expect(mockUpdateUsuario).not.toHaveBeenCalled();
    });

    it('deve renderizar mensagens de erro e sucesso se presentes no viewmodel', async () => {
        mockUseAuth.mockReturnValue({
            usuarioAtual: mockUsuario,
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: false,
        });

        jest.spyOn(MeuPerfilViewModelModule, 'useMeuPerfilViewModel').mockReturnValue({
            nome: 'Tester', setNome: jest.fn(),
            genero: 'Outro', setGenero: jest.fn(),
            generoOptions: [ { key: '1', label: 'Outro', value: 'Outro' } ], // 🟢 Adicionado para corrigir o erro
            dataNascimento: new Date('1990-01-01'), setDataNascimento: jest.fn(),
            avatarUrl: '', setAvatarUrl: jest.fn(),
            bio: 'Bio', setBio: jest.fn(),
            camisa: 'M', setCamisa: jest.fn(),
            calca: '40', setCalca: jest.fn(),
            calcado: '39', setCalcado: jest.fn(),
            interesses: ['Tecnologia', 'Moda'], novoInteresse: '', setNovoInteresse: jest.fn(),
            handleAddInteresse: jest.fn(), handleRemoveInteresse: jest.fn(),
            gostos: ['Chocolate', 'Futebol'], setGostos: jest.fn(), novoGosto: '', setNovoGosto: jest.fn(),
            handleAddGosto: jest.fn(), handleRemoveGosto: jest.fn(),
            evitar: ['Poeira', 'Mentiras'], setEvitar: jest.fn(), novoEvitar: '', setNovoEvitar: jest.fn(),
            handleAddEvitar: jest.fn(), handleRemoveEvitar: jest.fn(),
            isSaving: false,
            successMessage: 'Salvo com sucesso!',
            errorMessage: 'Erro inesperado!',
            handleSalvar: jest.fn(),
            clearMessages: jest.fn(),
            usuarioAtual: mockUsuario,
            isEditing: true, setIsEditing: jest.fn(),
        } as any);

        const { getByTestId } = render(<MeuPerfilScreen />);
        await act(async () => {});

        expect(getByTestId('success-message').props.children).toBe('Salvo com sucesso!');
        expect(getByTestId('error-message').props.children).toBe('Erro inesperado!');
    });

    it('deve chamar clearMessages ao clicar no backdrop ou nos toasts', async () => {
        mockUseAuth.mockReturnValue({
            usuarioAtual: mockUsuario,
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: false,
        });

        const mockClearMessages = jest.fn();

        jest.spyOn(MeuPerfilViewModelModule, 'useMeuPerfilViewModel').mockReturnValue({
            nome: 'Tester', setNome: jest.fn(),
            genero: 'Outro', setGenero: jest.fn(),
            generoOptions: [ { key: '1', label: 'Outro', value: 'Outro' } ], // 🟢 Adicionado para corrigir o erro
            dataNascimento: new Date('1990-01-01'), setDataNascimento: jest.fn(),
            avatarUrl: '', setAvatarUrl: jest.fn(),
            bio: 'Bio', setBio: jest.fn(),
            camisa: 'M', setCamisa: jest.fn(),
            calca: '40', setCalca: jest.fn(),
            calcado: '39', setCalcado: jest.fn(),
            interesses: ['Tecnologia', 'Moda'], novoInteresse: '', setNovoInteresse: jest.fn(),
            handleAddInteresse: jest.fn(), handleRemoveInteresse: jest.fn(),
            gostos: ['Chocolate', 'Futebol'], setGostos: jest.fn(), novoGosto: '', setNovoGosto: jest.fn(),
            handleAddGosto: jest.fn(), handleRemoveGosto: jest.fn(),
            evitar: ['Poeira', 'Mentiras'], setEvitar: jest.fn(), novoEvitar: '', setNovoEvitar: jest.fn(),
            handleAddEvitar: jest.fn(), handleRemoveEvitar: jest.fn(),
            isSaving: false,
            successMessage: 'Salvo com sucesso!',
            errorMessage: 'Erro inesperado!',
            handleSalvar: jest.fn(),
            clearMessages: mockClearMessages,
            usuarioAtual: mockUsuario,
            isEditing: true, setIsEditing: jest.fn(),
        } as any);

        const { getByTestId } = render(<MeuPerfilScreen />);
        await act(async () => {});

        const successToast = getByTestId('success-toast');
        fireEvent.press(successToast);
        expect(mockClearMessages).toHaveBeenCalledTimes(1);
        
        const errorToast = getByTestId('error-toast');
        fireEvent.press(errorToast);
        expect(mockClearMessages).toHaveBeenCalledTimes(2);
    });
});