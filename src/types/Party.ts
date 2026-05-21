export type PartyStatus =
  | "aguardando_pessoas"
  | "aguardando_sorteio"
  | "sorteado";

export interface Party {
  id: string;
  admin_id: string;
  name: string;
  event_date: string;
  min_value: number;
  max_value: number;
  invite_code: string;
  status: PartyStatus;
  block_dependent_draw: boolean;
  allow_wishlist_changes_after_draw: boolean;
  created_at: string;
  updated_at: string;
}
