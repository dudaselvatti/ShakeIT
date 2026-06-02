export type OwnerType = "user" | "dependent";

export interface Wishlist {
    id: string;
    owner_id: string;
    owner_type: OwnerType;
    list_name?: string;
    likes_tags: string[];
    avoids_tags: string[];
    created_at: string;
    updated_at: string;
}
