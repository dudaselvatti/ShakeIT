import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { PartyAdminScreen } from './index';
import { participantesMock } from '../../mocks/participantesMock';

jest.mock('@react-navigation/native', () => ({
    useRoute: () => ({
        params: {
        partyName: 'Festa Teste',
        partyCode: 'ABC123',
        },
    }),
}));

jest.mock('../../components/AppHeader', () => ({
    AppHeader: ({ headerTitle }: any) => {
        const { Text } = require('react-native');
        return <Text>{headerTitle}</Text>;
    },
}));

jest.mock('../../components/PartyQRCode', () => ({
    PartyQRCode: ({ partyCode }: any) => {
        const { Text } = require('react-native');
        return <Text>QR: {partyCode}</Text>;
    },
}));

jest.mock('../../components/ParticipanteCard', () => ({
    ParticipanteCard: ({ participante }: any) => {
        const { Text } = require('react-native');
        return <Text>{participante.usuario.nome}</Text>;
    },
}));

describe('PartyAdminScreen', () => {
    it('deve renderizar título do header', () => {
        render(<PartyAdminScreen />);
        expect(screen.getByText('Painel do Evento')).toBeTruthy();
    });

    it('deve renderizar nome e código da festa', () => {
        render(<PartyAdminScreen />);

        expect(screen.getByText('Festa Teste')).toBeTruthy();
        expect(screen.getByText(/Código:/)).toBeTruthy();
        expect(screen.getByText('ABC123')).toBeTruthy();
    });

    it('deve renderizar QR Code com partyCode', () => {
        render(<PartyAdminScreen />);
        expect(screen.getByText('QR: ABC123')).toBeTruthy();
    });

    it('deve exibir quantidade de perfis confirmados', () => {
        render(<PartyAdminScreen />);

        const confirmadosCount = participantesMock.filter(
            (p) => p.perfil.isConfirmado
        ).length;

        expect(
            screen.getByText(
                `Perfis confirmados: (${confirmadosCount}/${participantesMock.length})`
            )
        ).toBeTruthy();
    });
    
    it('deve renderizar botão de sorteio', () => {
        render(<PartyAdminScreen />);

        expect(screen.getByText('Realizar Sorteio')).toBeTruthy();
    });

    it('deve renderizar lista de participantes', () => {
        render(<PartyAdminScreen />);

        participantesMock.forEach((p) => {
        expect(screen.getByText(p.usuario.nome)).toBeTruthy();
        });
    });
});