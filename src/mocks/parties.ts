import { Party } from "../@types/Party";

export const MOCK_PARTIES: Party[] = [
  {
    id: "1",
    name: "Amigo Secreto IFSP",
    eventDate: "20/12/2026",
    drawDate: "15/04/2026", // aqui ta sem regra de negocio, isso tem que ser gerado automaticamente quando o sorteio for realizado, mas por enquanto é só pra teste mesmo
    minPrice: 50,
    maxPrice: 100,
    maxParticipants: 20,
    totalParticipants: 20,
    status: "Sorteio Realizado",
  },
  {
    id: "2",
    name: "Firma 2026",
    eventDate: "15/12/2026",
    drawDate: "", //sorteio ainda não realizado, então não tem data de sorteio
    minPrice: 80,
    maxPrice: 150,
    maxParticipants: 20,
    totalParticipants: 12,
    status: "Aguardando Sorteio",
  },
];
