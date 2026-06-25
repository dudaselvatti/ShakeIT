export type ParticipantStatus = "pendente" | "confirmado" | "removido" | "recusado";

export interface Sizes {
    camisa?: string;
    calca?: string;
    calcado?: string;
}

export interface Preferencias {
    coisasQueAmo?: string[];
    melhorEvitar?: string[];
}

export { Sizes as Medidas };

export interface Perfil {
    id: string;
    user_id: string;
    party_id: string;
    participant_type: "user" | "dependent";
    participant_name: string;
    participant_avatar: string;
    birth_date?: string;
    gender?: string;
    dependent_type?: string;
    bio?: string;
    wishlist_id?: string;
    status: ParticipantStatus;
    has_revealed_draw: boolean;
    sizes?: Sizes;
    preferencias?: Preferencias;
    created_at: string;
    updated_at: string;
}