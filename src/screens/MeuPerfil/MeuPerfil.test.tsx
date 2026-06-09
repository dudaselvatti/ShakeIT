import React from 'react';
import { render, fireEvent, renderHook, act } from '@testing-library/react-native';
import { MeuPerfilScreen } from './index';
import { useMeuPerfilViewModel } from './MeuPerfilViewModel';
import * as MeuPerfilViewModelModule from './MeuPerfilViewModel';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { updateUsuario } from '../../services/cloudDb/cloudDb';

jest.mock('../../contexts/AuthContext/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../services/cloudDb/cloudDb', () => ({
    updateUsuario: jest.fn(),
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
        PopupModal: ({ visible, onCancel, message }: any) => visible ? (
            <ReactNative.View testID="success-modal">
                <ReactNative.Text testID="success-message">{message}</ReactNative.Text>
                <ReactNative.Pressable onPress={onCancel} testID="success-toast">
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
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            usuarioAtual: mockUsuario,
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: false,
        });
    });

    it('deve retornar os dados iniciais do usuario no hook useMeuPerfilViewModel', () => {
        const { result } = renderHook(() => useMeuPerfilViewModel());

        expect(result.current.bio).toBe('Minha biografia');
        expect(result.current.camisa).toBe('M');
        expect(result.current.calca).toBe('40');
        expect(result.current.calcado).toBe('39');
        expect(result.current.interesses).toEqual(['Tecnologia', 'Moda']);
    });

    it('deve lidar com usuarioAtual nulo ou sem tamanhos especificados', () => {
        mockUseAuth.mockReturnValue({
            usuarioAtual: null,
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: true,
        });

        const { result: resultNull } = renderHook(() => useMeuPerfilViewModel());
        expect(resultNull.current.bio).toBe('');
        expect(resultNull.current.camisa).toBe('');
        expect(resultNull.current.calca).toBe('');
        expect(resultNull.current.calcado).toBe('');
        expect(resultNull.current.interesses).toEqual([]);

        mockUseAuth.mockReturnValue({
            usuarioAtual: {
                ...mockUsuario,
                sizes: undefined,
                bio: undefined,
                interesses: undefined,
            },
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: false,
        });

        const { result: resultNoSizes } = renderHook(() => useMeuPerfilViewModel());
        expect(resultNoSizes.current.bio).toBe('');
        expect(resultNoSizes.current.camisa).toBe('');
        expect(resultNoSizes.current.calca).toBe('');
        expect(resultNoSizes.current.calcado).toBe('');
        expect(resultNoSizes.current.interesses).toEqual([]);
    });

    it('deve atualizar os estados locais ao modificar no hook', () => {
        const { result } = renderHook(() => useMeuPerfilViewModel());

        act(() => {
            result.current.setBio('Nova Bio');
            result.current.setCamisa('G');
            result.current.setCalca('42');
            result.current.setCalcado('40');
            result.current.setNovoInteresse('Futebol');
        });

        expect(result.current.bio).toBe('Nova Bio');
        expect(result.current.camisa).toBe('G');
        expect(result.current.calca).toBe('42');
        expect(result.current.calcado).toBe('40');
        expect(result.current.novoInteresse).toBe('Futebol');

        act(() => {
            result.current.handleAddInteresse();
        });

        expect(result.current.interesses).toEqual(['Tecnologia', 'Moda', 'Futebol']);

        act(() => {
            result.current.handleRemoveInteresse('Moda');
        });

        expect(result.current.interesses).toEqual(['Tecnologia', 'Futebol']);
    });

    it('deve permitir salvar apenas 1 tamanho e limpar os outros', async () => {
        jest.useFakeTimers();
        mockUpdateUsuario.mockResolvedValue(undefined);
        const { result } = renderHook(() => useMeuPerfilViewModel());

        act(() => {
            result.current.setBio('Bio editada');
            result.current.setCamisa('G');
            result.current.setCalca('');
            result.current.setCalcado('');
        });

        await act(async () => {
            await result.current.handleSalvar();
        });

        expect(mockUpdateUsuario).toHaveBeenCalledWith('user-id-123', {
            bio: 'Bio editada',
            sizes: {
                camisa: 'G',
                calca: undefined,
                calcado: undefined,
            },
            interesses: ['Tecnologia', 'Moda'],
        });
        expect(mockUpdateUsuarioAtual).toHaveBeenCalledWith({
            bio: 'Bio editada',
            sizes: {
                camisa: 'G',
                calca: undefined,
                calcado: undefined,
            },
            interesses: ['Tecnologia', 'Moda'],
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
        await act(async () => {
            await result.current.handleSalvar();
        });

        expect(mockUpdateUsuario).not.toHaveBeenCalled();
    });

    it('deve renderizar a tela de meu perfil com os componentes e dados corretos', () => {
        const { getByDisplayValue, getByText, queryByTestId } = render(<MeuPerfilScreen />);

        expect(getByText('Meu Perfil')).toBeTruthy();
        expect(getByDisplayValue('Minha biografia')).toBeTruthy();
        expect(getByText('Salvar Alterações')).toBeTruthy();
        expect(queryByTestId('success-message')).toBeNull();
        expect(queryByTestId('error-message')).toBeNull();
        expect(getByText('Tecnologia')).toBeTruthy();
        expect(getByText('Moda')).toBeTruthy();
    });

    it('deve animar e sumir com a mensagem de sucesso no componente real', async () => {
        jest.useFakeTimers();
        mockUpdateUsuario.mockResolvedValue(undefined);

        const { getByText, queryByTestId } = render(<MeuPerfilScreen />);

        const saveButton = getByText('Salvar Alterações');
        await act(async () => {
            fireEvent.press(saveButton);
        });

        expect(getByText('Perfil atualizado com sucesso!')).toBeTruthy();

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(queryByTestId('success-message')).toBeNull();
        jest.useRealTimers();
    });

    it('deve renderizar mensagens de erro e sucesso se presentes no viewmodel', () => {
        mockUseAuth.mockReturnValue({
            usuarioAtual: mockUsuario,
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: false,
        });

        jest.spyOn(MeuPerfilViewModelModule, 'useMeuPerfilViewModel').mockReturnValue({
            bio: 'Bio',
            setBio: jest.fn(),
            camisa: 'M',
            setCamisa: jest.fn(),
            calca: '40',
            setCalca: jest.fn(),
            calcado: '39',
            setCalcado: jest.fn(),
            interesses: ['Tecnologia', 'Moda'],
            novoInteresse: '',
            setNovoInteresse: jest.fn(),
            handleAddInteresse: jest.fn(),
            handleRemoveInteresse: jest.fn(),
            isSaving: false,
            successMessage: 'Salvo com sucesso!',
            errorMessage: 'Erro inesperado!',
            handleSalvar: jest.fn(),
            clearMessages: jest.fn(),
            usuarioAtual: mockUsuario,
        });

        const { getByTestId } = render(<MeuPerfilScreen />);

        expect(getByTestId('success-message').props.children).toBe('Salvo com sucesso!');
        expect(getByTestId('error-message').props.children).toBe('Erro inesperado!');
    });

    it('deve chamar clearMessages ao clicar no backdrop ou nos toasts', () => {
        mockUseAuth.mockReturnValue({
            usuarioAtual: mockUsuario,
            updateUsuarioAtual: mockUpdateUsuarioAtual,
            isLoading: false,
        });

        const mockClearMessages = jest.fn();

        jest.spyOn(MeuPerfilViewModelModule, 'useMeuPerfilViewModel').mockReturnValue({
            bio: 'Bio',
            setBio: jest.fn(),
            camisa: 'M',
            setCamisa: jest.fn(),
            calca: '40',
            setCalca: jest.fn(),
            calcado: '39',
            setCalcado: jest.fn(),
            interesses: ['Tecnologia', 'Moda'],
            novoInteresse: '',
            setNovoInteresse: jest.fn(),
            handleAddInteresse: jest.fn(),
            handleRemoveInteresse: jest.fn(),
            isSaving: false,
            successMessage: 'Salvo com sucesso!',
            errorMessage: 'Erro inesperado!',
            handleSalvar: jest.fn(),
            clearMessages: mockClearMessages,
            usuarioAtual: mockUsuario,
        });

        const { getByTestId } = render(<MeuPerfilScreen />);

        const backdrop = getByTestId('message-backdrop');
        const successToast = getByTestId('success-toast');
        const errorToast = getByTestId('error-toast');

        fireEvent.press(backdrop);
        expect(mockClearMessages).toHaveBeenCalledTimes(1);

        fireEvent.press(successToast);
        expect(mockClearMessages).toHaveBeenCalledTimes(2);

        fireEvent.press(errorToast);
        expect(mockClearMessages).toHaveBeenCalledTimes(3);
    });
});
