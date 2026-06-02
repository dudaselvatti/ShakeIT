import { Perfil } from '../types/Perfil'

export const perfisMock: Perfil[] = [
    {
        id: "550e8400-e29b-41d4-a716-556655440001",
        user_id: "550e8400-e29b-41d4-a716-446655440001",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Admin",
        participant_avatar: "https://i.pravatar.cc/150?img=1",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "M",
            calca: "40",
            calcado: "40"
        },
        preferencias: {
            coisasQueAmo: ["Administração"],
            melhorEvitar: ["Desordem"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440002",
        user_id: "550e8400-e29b-41d4-a716-446655440002",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Maria da Silva",
        participant_avatar: "https://i.pravatar.cc/150?img=2",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "P",
            calca: "36",
            calcado: "36"
        },
        preferencias: {
            coisasQueAmo: ["Maquiagem", "Moda", "Perfumes"],
            melhorEvitar: ["Roupas muito formais", "Chocolate amargo"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440003",
        user_id: "550e8400-e29b-41d4-a716-446655440003",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "João da Silva",
        participant_avatar: "https://i.pravatar.cc/150?img=3",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "M",
            calca: "40",
            calcado: "40"
        },
        preferencias: {
            coisasQueAmo: ["Futebol", "Música"],
            melhorEvitar: ["Livros"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440004",
        user_id: "550e8400-e29b-41d4-a716-446655440004",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Ana Souza",
        participant_avatar: "https://i.pravatar.cc/150?img=4",
        status: "pendente",
        has_revealed_draw: false,
        sizes: {
            camisa: "M",
            calca: "38",
            calcado: "37"
        },
        preferencias: {
            coisasQueAmo: ["Skincare", "Velas aromáticas", "Séries"],
            melhorEvitar: ["Produtos com cheiro forte", "Roupas apertadas"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440005",
        user_id: "550e8400-e29b-41d4-a716-446655440005",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Mario Beso",
        participant_avatar: "https://i.pravatar.cc/150?img=5",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "XGG",
            calca: "XGG",
            calcado: "33"
        },
        preferencias: {
            coisasQueAmo: ["Comida", "Chocolate", "Comida, de novo"],
            melhorEvitar: ["Fome"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440006",
        user_id: "550e8400-e29b-41d4-a716-446655440006",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Laura Johnson",
        participant_avatar: "https://i.pravatar.cc/150?img=6",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "M",
            calca: "38",
            calcado: "37"
        },
        preferencias: {
            coisasQueAmo: ["Decoração", "Plantas", "Chás"],
            melhorEvitar: ["Objetos muito coloridos", "Café forte"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440007",
        user_id: "550e8400-e29b-41d4-a716-446655440006",
        party_id: "party-001",
        participant_type: "dependent",
        participant_name: "John Johnson",
        participant_avatar: "https://i.pravatar.cc/150?img=7",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "10",
            calca: "10",
            calcado: "30"
        },
        preferencias: {
            coisasQueAmo: ["Brinquedos", "Super-heróis", "Video game"],
            melhorEvitar: ["Roupas formais", "Livros longos"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440008",
        user_id: "550e8400-e29b-41d4-a716-446655440008",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Juliana Rocha",
        participant_avatar: "https://i.pravatar.cc/150?img=8",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "P",
            calca: "36",
            calcado: "35"
        },
        preferencias: {
            coisasQueAmo: ["Academia", "Roupas fitness", "Saúde"],
            melhorEvitar: ["Doces", "Fast food"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440009",
        user_id: "550e8400-e29b-41d4-a716-446655440009",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Pedro Alves",
        participant_avatar: "https://i.pravatar.cc/150?img=9",
        status: "pendente",
        has_revealed_draw: false,
        sizes: {
            camisa: "G",
            calca: "42",
            calcado: "41"
        },
        preferencias: {
            coisasQueAmo: ["Cerveja artesanal", "Churrasco", "Esportes"],
            melhorEvitar: ["Doces", "Veganismo"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440010",
        user_id: "550e8400-e29b-41d4-a716-446655440010",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Carla Mendes",
        participant_avatar: "https://i.pravatar.cc/150?img=10",
        status: "pendente",
        has_revealed_draw: false,
        sizes: {
            camisa: "M",
            calca: "38",
            calcado: "36"
        },
        preferencias: {
            coisasQueAmo: ["Romance", "Chocolates", "Cinema"],
            melhorEvitar: ["Filmes de terror", "Café"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440011",
        user_id: "550e8400-e29b-41d4-a716-446655440011",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Lucas Oliveira",
        participant_avatar: "https://i.pravatar.cc/150?img=11",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "G",
            calca: "42",
            calcado: "42"
        },
        preferencias: {
            coisasQueAmo: ["Tecnologia", "Gadgets", "Café"],
            melhorEvitar: ["Roupas coloridas", "Chás"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440012",
        user_id: "550e8400-e29b-41d4-a716-446655440012",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Beatriz Santos",
        participant_avatar: "https://i.pravatar.cc/150?img=12",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "P",
            calca: "38",
            calcado: "35"
        },
        preferencias: {
            coisasQueAmo: ["Livros de fantasia", "Papelaria", "Gatos"],
            melhorEvitar: ["Esportes radicais", "Bebidas alcoólicas"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440013",
        user_id: "550e8400-e29b-41d4-a716-446655440013",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Ricardo Lima",
        participant_avatar: "https://i.pravatar.cc/150?img=13",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "GG",
            calca: "46",
            calcado: "43"
        },
        preferencias: {
            coisasQueAmo: ["Pescaria", "Ferramentas", "Rock clássico"],
            melhorEvitar: ["Shopping centers", "Tecido sintético"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440014",
        user_id: "550e8400-e29b-41d4-a716-446655440014",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Fernanda Costa",
        participant_avatar: "https://i.pravatar.cc/150?img=14",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "M",
            calca: "40",
            calcado: "37"
        },
        preferencias: {
            coisasQueAmo: ["Vinho", "Cozinha italiana", "Viagens"],
            melhorEvitar: ["Comida picante", "Inverno"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    },
    {
        id: "550e8400-e29b-41d4-a716-556655440015",
        user_id: "550e8400-e29b-41d4-a716-446655440015",
        party_id: "party-001",
        participant_type: "user",
        participant_name: "Gabriel Pereira",
        participant_avatar: "https://i.pravatar.cc/150?img=15",
        status: "confirmado",
        has_revealed_draw: false,
        sizes: {
            camisa: "M",
            calca: "40",
            calcado: "41"
        },
        preferencias: {
            coisasQueAmo: ["Animes", "Jogos de tabuleiro", "Salgadinhos"],
            melhorEvitar: ["Roupas sociais", "Acordar cedo"]
        },
        created_at: "2024-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z"
    }
];
