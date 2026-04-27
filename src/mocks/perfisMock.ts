interface Medidas {
    camisa: string;
    calca: string;
    calcado: string;
};

interface Preferencias {
    coisasQueAmo: string[];
    melhorEvitar: string[];
};

interface Perfil {
    idUsuario: number;
    isConfirmado: boolean;
    medidas: Medidas;
    preferencias: Preferencias;
    isDependente: boolean;
    idDependente?: number;
};

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
    }
];