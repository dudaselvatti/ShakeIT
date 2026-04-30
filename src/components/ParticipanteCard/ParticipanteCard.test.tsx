import React from 'react';
import { render } from '@testing-library/react-native';
import { ParticipanteCard } from './index';
import { Participante } from '../../types/Participante';

const mockParticipante: Participante = {
    usuario: {
        id: 101,
        email: 'zeninguem@email.com',
        senha: '12345',
        nome: 'Zé ninguém',
        fotoUrl: "https://i.pravatar.cc/150?img=1",
        genero: "Masculino",
        dataDeNascimento: "2003-12-01"
    },
    perfil: {
        idUsuario: 101,
        isConfirmado: false,
        medidas: {
            camisa: "M",
            calca: "42",
            calcado: "43"
        },
        preferencias: {
            coisasQueAmo: ["Nada"],
            melhorEvitar: ["Tudo"]
        },
        isDependente: false
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
        const participanteConfirmado: Participante = {
            ...mockParticipante,
            perfil: {
                ...mockParticipante.perfil,
                isConfirmado: true,
            },
        };

        const { getByText, queryByText } = render(
            <ParticipanteCard participante={participanteConfirmado} />
        );

        expect(getByText('🔒')).toBeTruthy();
        expect(queryByText('Pendente')).toBeNull();
        expect(queryByText('🔓')).toBeNull();
    });
});