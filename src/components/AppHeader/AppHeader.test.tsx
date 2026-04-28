import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppHeader } from './index';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useNavigation: () => ({
            goBack: mockGoBack,
        }),
    };
});

describe('Componente: AppHeader', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('mostra o título corretamente', () => {
        const title = 'Minha Tela';
        const { getByText } = render(<AppHeader headerTitle={title} />);
        expect(getByText(title)).toBeTruthy();
    });

    it('chama goBack quando o botão de retorno é pressionado', () => {
        const { getByText } = render(<AppHeader headerTitle="Teste" />);

        const backButton = getByText('←');

        fireEvent.press(backButton);

        expect(mockGoBack).toHaveBeenCalledTimes(1);
    });
});