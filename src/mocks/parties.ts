import { Party } from "../@types/Party";

export const MOCK_PARTIES: Party[] = [
  {
    id: "1",
    name: "Amigo Secreto IFSP",
    eventDate: "20/12/2026",
    drawDate: "15/04/2026",
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
    drawDate: "",
    minPrice: 80,
    maxPrice: 150,
    maxParticipants: 20,
    totalParticipants: 12,
    status: "Aguardando Sorteio",
  },
];
