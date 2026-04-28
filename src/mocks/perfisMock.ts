import { Perfil } from '../@types/Perfil'

export const perfisMock: Perfil[] = [
    {
        idUsuario: 1,
        isConfirmado: true,
        medidas: {
            camisa: "M",
            calca: "40",
            calcado: "40"
        },
        preferencias: {
            coisasQueAmo: ["Administração"],
            melhorEvitar: ["Desordem"]
        },
        isDependente: false, 
    },
    {
        idUsuario: 2,
        isConfirmado: true,
        medidas: {
            camisa: "P",
            calca: "36",
            calcado: "36"
        },
        preferencias: {
            coisasQueAmo: ["Maquiagem", "Moda", "Perfumes"],
            melhorEvitar: ["Roupas muito formais", "Chocolate amargo"]
        },
        isDependente: false
    },
    {
        idUsuario: 3,
        isConfirmado: true,
        medidas: {
            camisa: "M",
            calca: "40",
            calcado: "40"
        },
        preferencias: {
            coisasQueAmo: ["Futebol", "Música"],
            melhorEvitar: ["Livros"]
        },
        isDependente: false
    },
    {
        idUsuario: 4,
        isConfirmado: false,
        medidas: {
            camisa: "M",
            calca: "38",
            calcado: "37"
        },
        preferencias: {
            coisasQueAmo: ["Skincare", "Velas aromáticas", "Séries"],
            melhorEvitar: ["Produtos com cheiro forte", "Roupas apertadas"]
        },
        isDependente: false
    },
    {
        idUsuario: 5,
        isConfirmado: true,
        medidas: {
            camisa: "XGG",
            calca: "XGG",
            calcado: "33"
        },
        preferencias: {
            coisasQueAmo: ["Comida", "Chocolate", "Comida, de novo"],
            melhorEvitar: ["Fome"]
        },
        isDependente: false
    },
    {
        idUsuario: 6,
        isConfirmado: true,
        medidas: {
            camisa: "M",
            calca: "38",
            calcado: "37"
        },
        preferencias: {
            coisasQueAmo: ["Decoração", "Plantas", "Chás"],
            melhorEvitar: ["Objetos muito coloridos", "Café forte"]
        },
        isDependente: false
    },
    {
        idUsuario: 7,
        isConfirmado: true,
        medidas: {
            camisa: "10",
            calca: "10",
            calcado: "30"
        },
        preferencias: {
            coisasQueAmo: ["Brinquedos", "Super-heróis", "Video game"],
            melhorEvitar: ["Roupas formais", "Livros longos"]
        },
        isDependente: true,
        idDependente: 6
    },
    {
        idUsuario: 8,
        isConfirmado: true,
        medidas: {
            camisa: "P",
            calca: "36",
            calcado: "35"
        },
        preferencias: {
            coisasQueAmo: ["Academia", "Roupas fitness", "Saúde"],
            melhorEvitar: ["Doces", "Fast food"]
        },
        isDependente: false
    },
    {
        idUsuario: 9,
        isConfirmado: false,
        medidas: {
            camisa: "G",
            calca: "42",
            calcado: "41"
        },
        preferencias: {
            coisasQueAmo: ["Cerveja artesanal", "Churrasco", "Esportes"],
            melhorEvitar: ["Doces", "Veganismo"]
        },
        isDependente: false
    },
    {
        idUsuario: 10,
        isConfirmado: false,
        medidas: {
            camisa: "M",
            calca: "38",
            calcado: "36"
        },
        preferencias: {
            coisasQueAmo: ["Romance", "Chocolates", "Cinema"],
            melhorEvitar: ["Filmes de terror", "Café"]
        },
        isDependente: false
    },
    {
        idUsuario: 11,
        isConfirmado: true,
        medidas: {
            camisa: "G",
            calca: "42",
            calcado: "42"
        },
        preferencias: {
            coisasQueAmo: ["Tecnologia", "Gadgets", "Café"],
            melhorEvitar: ["Roupas coloridas", "Chás"]
        },
        isDependente: false
    },
    {
        idUsuario: 12,
        isConfirmado: true,
        medidas: {
            camisa: "P",
            calca: "38",
            calcado: "35"
        },
        preferencias: {
            coisasQueAmo: ["Livros de fantasia", "Papelaria", "Gatos"],
            melhorEvitar: ["Esportes radicais", "Bebidas alcoólicas"]
        },
        isDependente: false
    },
    {
        idUsuario: 13,
        isConfirmado: true,
        medidas: {
            camisa: "GG",
            calca: "46",
            calcado: "43"
        },
        preferencias: {
            coisasQueAmo: ["Pescaria", "Ferramentas", "Rock clássico"],
            melhorEvitar: ["Shopping centers", "Tecido sintético"]
        },
        isDependente: false
    },
    {
        idUsuario: 14,
        isConfirmado: true,
        medidas: {
            camisa: "M",
            calca: "40",
            calcado: "37"
        },
        preferencias: {
            coisasQueAmo: ["Vinho", "Cozinha italiana", "Viagens"],
            melhorEvitar: ["Comida picante", "Inverno"]
        },
        isDependente: false
    },
    {
        idUsuario: 15,
        isConfirmado: true,
        medidas: {
            camisa: "M",
            calca: "40",
            calcado: "41"
        },
        preferencias: {
            coisasQueAmo: ["Animes", "Jogos de tabuleiro", "Salgadinhos"],
            melhorEvitar: ["Roupas sociais", "Acordar cedo"]
        },
        isDependente: false
    }
];
