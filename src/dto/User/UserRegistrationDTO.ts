export interface UserRegistrationDTO {
    email: string;
    senha: string;
    nome: string;
    genero: string;
    birth_date: Date;
    //height?: number,
    avatar_url?: string;
    bio?: string;
    sizes: {
        camisa?: string;
        calca?: string;
        calcado?: string;
    };
}