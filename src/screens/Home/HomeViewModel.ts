import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import { Party } from "../../types/Party";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getDrawResultByGiverProfileId } from "../../services/cloud/DrawResult/DrawResultDb";
import { getPartyParticipantByUserIdAndPartyId } from "../../services/cloud/PartyParticipant/PartyParticipantDb";
import { getPartiesByUserId } from "../../services/cloud/Party/PartyDb";
import { getUserById } from "../../services/cloud/User/UserDb";

import { useQuery } from '@tanstack/react-query';

export type PartyWithAdmin = Party & { adminName: string };

export function useHomeViewModel() {
  const navigation = useNavigation<any>();
  const { usuarioAtual } = useAuth();

  const [hideFinished, setHideFinished] = useState(false);
  const [filterType, setFilterType] = useState<"todos" | "meus" | "outros">("todos");

  const { data: parties = [] } = useQuery({
    queryKey: ['parties', usuarioAtual?.id],
    queryFn: async () => {
      if (!usuarioAtual?.id) return [];
      
      const result = await getPartiesByUserId(usuarioAtual.id);
      
      const uniqueAdminIds = [...new Set(result.map(p => p.admin_id))];
      const adminUsersMap = new Map();
      
      await Promise.all(uniqueAdminIds.map(async (id) => {
        if (id === usuarioAtual.id) return;
        const user = await getUserById(id);
        adminUsersMap.set(id, user?.nome || "Outro");
      }));
      
      const partiesWithAdmin: PartyWithAdmin[] = result.map((party) => {
          if (party.admin_id === usuarioAtual.id) {
            return { ...party, adminName: "Você" };
          } else {
            return { ...party, adminName: adminUsersMap.get(party.admin_id) || "Outro" };
          }
      });

      const getStatusRank = (status: string) => {
        if (status === "aguardando_pessoas") return 1;
        if (status === "aguardando_sorteio") return 2;
        return 3;
      };

      return partiesWithAdmin.sort((a, b) => {
        const isA_Admin = a.admin_id === usuarioAtual.id ? 0 : 1;
        const isB_Admin = b.admin_id === usuarioAtual.id ? 0 : 1;
        if (isA_Admin !== isB_Admin) return isA_Admin - isB_Admin;

        const statusA = getStatusRank(a.status);
        const statusB = getStatusRank(b.status);
        if (statusA !== statusB) return statusA - statusB;

        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      });
    },
    enabled: !!usuarioAtual?.id,
  });

  let visibleParties = parties;
  if (hideFinished) {
    visibleParties = visibleParties.filter(party => {
      const eventDate = new Date(party.event_date);
      eventDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate.getTime() >= today.getTime();
    });
  }
  if (filterType === "meus") {
    visibleParties = visibleParties.filter(party => party.admin_id === usuarioAtual?.id);
  } else if (filterType === "outros") {
    visibleParties = visibleParties.filter(party => party.admin_id !== usuarioAtual?.id);
  }

  const handleCardPress = async (party: Party) => {
    switch (party.status) {
      case "aguardando_sorteio":
        if (party.admin_id === usuarioAtual?.id) {
          navigation.navigate("PartyAdmin", {
            partyId: party.id,
          });
        } else {
          navigation.navigate("ParticipantLobby", {
            partyId: party.id,
          });
        }
        break;
      case "sorteio_realizado":
      case "sorteio_revelado":
        try {

          if (!usuarioAtual?.id) {
            return;
          }
          const participant =
            await getPartyParticipantByUserIdAndPartyId(usuarioAtual.id, party.id);
          if (!participant) {
            throw new Error("Participante não encontrado");
          }
          if (!participant.perfil.has_revealed_draw && !participant.has_revealed_draw) {
            navigation.navigate("ShakeReveal", { partyId: party.id });
          } else {
            const draw = await getDrawResultByGiverProfileId(party.id, participant.perfil.id);
            if (!draw) {
              throw new Error("Sorteio não encontrado");
            }
            navigation.navigate("PerfilSorteado", { partyId: party.id });
          }
        } catch (error) {
          console.error("Erro ao abrir sorteado:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
        }
        break;
      default:
        break;
    }
  };

  const handleCreateParty = () => {
    navigation.navigate("CreateParty");
  };

  const handleScanPress = () => {
    navigation.navigate("Scan");
  };

  return {
    parties: visibleParties,
    hideFinished,
    setHideFinished,
    filterType,
    setFilterType,
    handleCardPress,
    handleCreateParty,
    handleScanPress,
    userName: usuarioAtual?.nome || "Visitante",
  };
};