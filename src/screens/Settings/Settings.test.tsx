import React from 'react';
import { render } from '@testing-library/react-native';
import { SettingsScreen } from './index';

describe('SettingsScreen', () => {
    it('deve renderizar a tela de configurações', () => {
        const { getByText } = render(<SettingsScreen />);
        expect(getByText('Configurações em breve!')).toBeTruthy();
    });
});
