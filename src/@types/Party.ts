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
  maxParticipants: number; //pessoas convidadas que ainda nao confirmaram presença
  totalParticipants?: number; //pessoas que já confirmaram presença
  status: PartyStatus;
  //tem que trazer profiles aqui tambem(perfils dos usuarios que lockaram)
  //dono da party -> pensar como vamos diferenciar party criadas do usuario e party que ele participa
}
