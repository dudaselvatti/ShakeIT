import React from 'react';
import { render } from '@testing-library/react-native';
import { ParticipanteCard } from './index';
import { Participante } from '../../@types/Participante';

const mockParticipante: Participante = {
    usuario: {
        nome: 'Zé ninguém',
    },
    perfil: {
        isConfirmado: false,
    },
};

describe('ParticipanteCard Component', () => {

    it('deve renderizar o nome do participante corretamente', () => {
        const { getByText } = render(
            <ParticipanteCard participante={mockParticipante} />
        );

        expect(getByText('Zé ninguém')).toBeTruthy();
    });

    it('deve exibir o status "Pendente" e o cadeado aberto quando não estiver confirmado', () => {
        const { getByText, queryByText } = render(
            <ParticipanteCard participante={mockParticipante} />
        );

        expect(getByText('Pendente')).toBeTruthy();
        expect(getByText('🔓')).toBeTruthy();
        expect(queryByText('🔒')).toBeNull();
    });

    it('deve exibir apenas o cadeado fechado quando o participante estiver confirmado', () => {
        const participanteConfirmado = {
            ...mockParticipante,
            perfil: { isConfirmado: true },
        };

        const { getByText, queryByText } = render(
            <ParticipanteCard participante={participanteConfirmado} />
        );

        expect(getByText('🔒')).toBeTruthy();

        expect(queryByText('Pendente')).toBeNull();
        expect(queryByText('🔓')).toBeNull();
    });
});