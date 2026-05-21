import { Party } from "../types/Party";

export const partiesMock: Party[] = [
  {
    id: "party-001",
    admin_id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Amigo Secreto IFSP",
    event_date: "2026-12-20",
    min_value: 50,
    max_value: 100,
    invite_code: "#STM32F",
    status: "sorteado",
    block_dependent_draw: false,
    allow_wishlist_changes_after_draw: false,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T14:30:00Z"
  },
  {
    id: "party-002",
    admin_id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Firma 2026",
    event_date: "2026-12-15",
    min_value: 80,
    max_value: 150,
    invite_code: "#103C8T",
    status: "aguardando_sorteio",
    block_dependent_draw: false,
    allow_wishlist_changes_after_draw: true,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z"
  }
];
