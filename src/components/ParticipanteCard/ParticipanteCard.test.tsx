import React from 'react';
import { render } from '@testing-library/react-native';
import { Image } from 'react-native';
import { ParticipanteCard } from './index';
import { PartyParticipant } from '../../types/PartyParticipant';

const mockParticipante: PartyParticipant = {
    usuario: {
        id: "550e8400-e29b-41d4-a716-446655440101",
        email: 'zeninguem@email.com',
        nome: 'Zé ninguém',
        avatar_url: "https://i.pravatar.cc/150?img=1",
        genero: "Masculino",
        birth_date: "2003-12-01",
        shake_enabled: true,
        dark_mode: false,
        notifications_enabled: true,
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    perfil: {
        id: "550e8400-e29b-41d4-a716-556655440101",
        user_id: "550e8400-e29b-41d4-a716-446655440101",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Zé ninguém",
        participant_avatar: "https://i.pravatar.cc/150?img=1",
        status: "pendente",
        has_revealed_draw: false,
        sizes: {
            camisa: "M",
            calca: "42",
            calcado: "43"
        },
        preferencias: {
            coisasQueAmo: ["Nada"],
            melhorEvitar: ["Tudo"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
};

describe('ParticipanteCard Component', () => {

    it('deve renderizar o nome do participante corretamente', () => {
        const { getByText } = render(
            <ParticipanteCard participante={mockParticipante} />
        );

        expect(getByText('Zé ninguém')).toBeTruthy();
    });

    it('deve exibir o status "pendente" e o cadeado aberto quando não estiver confirmado', () => {
        const { getByText, UNSAFE_getAllByType } = render(
            <ParticipanteCard participante={mockParticipante} />
        );

        expect(getByText('pendente')).toBeTruthy();
        const images = UNSAFE_getAllByType(Image);
        expect(images[1].props.source).toEqual(require('../../../assets/cadeado-aberto.png'));
    });

    it('deve exibir apenas o cadeado fechado quando o participante estiver confirmado', () => {
        const participanteConfirmado: PartyParticipant = {
            ...mockParticipante,
            perfil: {
                ...mockParticipante.perfil,
                status: "confirmado",
            },
        };

        const { queryByText, UNSAFE_getAllByType } = render(
            <ParticipanteCard participante={participanteConfirmado} />
        );

        const images = UNSAFE_getAllByType(Image);
        expect(images[1].props.source).toEqual(require('../../../assets/cadeado-fechado.png'));
        expect(queryByText('pendente')).toBeNull();
    });
});
