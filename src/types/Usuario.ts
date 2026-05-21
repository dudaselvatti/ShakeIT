export interface Sizes {
    camisa?: string;
    calca?: string;
    calcado?: string;
}

export interface Usuario {
    id: string;
    email: string;
    nome: string;
    genero: string;
    birth_date: string;
    height?: number;
    avatar_url: string;
    sizes?: Sizes;
    bio?: string;
    shake_enabled: boolean;
    dark_mode: boolean;
    notifications_enabled: boolean;
    created_at: string;
    updated_at: string;
}