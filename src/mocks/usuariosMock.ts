interface Usuario {
    id: number;
    email: string;
    senha: string;
    nome: string;
    fotoUrl: string;
    genero: string;
    dataDeNascimento: string;
};

export const usuariosMock: Usuario[] = [
    {
        id: 1,
        email: "admin@email.com",
        senha: "12345",
        nome: "Admin",
        fotoUrl: "https://i.pravatar.cc/150?img=1",
        genero: "Masculino",
        dataDeNascimento: "1959-05-19"
    },
    {
        id: 2,
        email: "mariadasilva@email.com",
        senha: "12345",
        nome: "Maria da Silva",
        fotoUrl: "https://i.pravatar.cc/150?img=2",
        genero: "Feminino",
        dataDeNascimento: "1995-05-10"
    },
    {
        id: 3,
        email: "joaodasilva@email.com",
        senha: "12345",
        nome: "João da Silva",
        fotoUrl: "https://i.pravatar.cc/150?img=3",
        genero: "Masculino",
        dataDeNascimento: "1988-03-22"
    },
    {
        id: 4,
        email: "anasouza@email.com",
        senha: "12345",
        nome: "Ana Souza",
        fotoUrl: "https://i.pravatar.cc/150?img=4",
        genero: "Feminino",
        dataDeNascimento: "2000-07-15"
    },
    {
        id: 5,
        email: "mariobeso@email.com",
        senha: "12345",
        nome: "Mario Beso",
        fotoUrl: "https://i.pravatar.cc/150?img=5",
        genero: "Masculino",
        dataDeNascimento: "1992-11-30"
    },
    {
        id: 6,
        email: "laurajohnson@email.com",
        senha: "12345",
        nome: "Laura Johnson",
        fotoUrl: "https://i.pravatar.cc/150?img=6",
        genero: "Feminino",
        dataDeNascimento: "1984-09-09"
    },
    {
        id: 7,
        email: "johnjohnson@email.com",
        senha: "12345",
        nome: "John Johnson",
        fotoUrl: "https://i.pravatar.cc/150?img=7",
        genero: "Masculino",
        dataDeNascimento: "2015-12-16"
    },
    {
        id: 8,
        email: "julianarocha@email.com",
        senha: "12345",
        nome: "Juliana Rocha",
        fotoUrl: "https://i.pravatar.cc/150?img=8",
        genero: "Feminino",
        dataDeNascimento: "1993-04-18"
    },
    {
        id: 9,
        email: "pedroalves@email.com",
        senha: "12345",
        nome: "Pedro Alves",
        fotoUrl: "https://i.pravatar.cc/150?img=9",
        genero: "Masculino",
        dataDeNascimento: "1991-06-25"
    },
    {
        id: 10,
        email: "carlamendes@email.com",
        senha: "12345",
        nome: "Carla Mendes",
        fotoUrl: "https://i.pravatar.cc/150?img=10",
        genero: "Feminino",
        dataDeNascimento: "1997-02-14"
    },
];