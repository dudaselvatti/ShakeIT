export type PartyStatus =
  | "Aguardando Sorteio"
  | "Sorteio Realizado"
  | "Fim do evento";

export interface Party {
  id: string;
  name: string;
  eventDate: string;
  drawDate?: string;
  minPrice: number;
  maxPrice: number;
  idAdmin: number,
  inviteCode: string,
  status: PartyStatus;
}
