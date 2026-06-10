export type DependentType = "child" | "pet" | "other";

export interface Sizes {
    camisa?: string;
    calca?: string;
    calcado?: string;
}

export interface Dependent {
    id: string;
    user_id: string;
    name: string;
    dependent_type: DependentType;
    birth_date: string;
    avatar_url: string;
    gender: string;
    sizes?: Sizes;
    bio?: string;
    relationship?: string;
    created_at: string;
    updated_at: string;
}
