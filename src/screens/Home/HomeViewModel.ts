import { useNavigation } from "@react-navigation/native";
import { Party } from "../../types/Party";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getDrawResultByGiverProfileId } from "../../services/cloud/DrawResult/DrawResultDb";
import { getPartyParticipantByUserIdAndPartyId } from "../../services/cloud/PartyParticipant/PartyParticipantDb";
import { getPartiesByUserId } from "../../services/cloud/Party/PartyDb";
import { getUserById } from "../../services/cloud/User/UserDb";

export type PartyWithAdmin = Party & { adminName: string };

export function useHomeViewModel() {
  const navigation = useNavigation<any>();
  const { usuarioAtual } = useAuth();
  const [parties, setParties] = useState<PartyWithAdmin[]>([]);

  const [hideFinished, setHideFinished] = useState(false);
  const [filterType, setFilterType] = useState<"todos" | "meus" | "outros">("todos");

  useEffect(() => {
    async function loadParties() {
      if (!usuarioAtual?.id) {
        return;
      }
      try {
        const result = await getPartiesByUserId(usuarioAtual.id);
        
        const partiesWithAdmin: PartyWithAdmin[] = await Promise.all(
          result.map(async (party) => {
            if (party.admin_id === usuarioAtual.id) {
              return { ...party, adminName: "Você" };
            } else {
              const adminUser = await getUserById(party.admin_id);
              return { ...party, adminName: adminUser?.nome || "Outro" };
            }
          })
        );

        const getStatusRank = (status: string) => {
          if (status === "aguardando_pessoas") return 1;
          if (status === "aguardando_sorteio") return 2;
          return 3;
        };

        const sortedParties = partiesWithAdmin.sort((a, b) => {
          const isA_Admin = a.admin_id === usuarioAtual.id ? 0 : 1;
          const isB_Admin = b.admin_id === usuarioAtual.id ? 0 : 1;
          if (isA_Admin !== isB_Admin) return isA_Admin - isB_Admin;

          const statusA = getStatusRank(a.status);
          const statusB = getStatusRank(b.status);
          if (statusA !== statusB) return statusA - statusB;

          return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
        });

        setParties(sortedParties);
      } catch (error) {
        console.error("Erro ao carregar parties:", error);
      }
    }
    loadParties();
  }, [usuarioAtual]);

  let visibleParties = parties;
  if (hideFinished) {
    visibleParties = visibleParties.filter(party => {
      const eventDate = new Date(party.event_date + "T00:00:00");
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