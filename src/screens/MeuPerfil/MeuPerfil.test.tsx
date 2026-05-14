import React from 'react';
import { render } from '@testing-library/react-native';
import { MeuPerfilScreen } from './index';

describe('MeuPerfilScreen', () => {
    it('deve renderizar a tela de meu perfil', () => {
        const { getByText } = render(<MeuPerfilScreen />);
        expect(getByText('Meu Perfil - Em breve!')).toBeTruthy();
    });
});
