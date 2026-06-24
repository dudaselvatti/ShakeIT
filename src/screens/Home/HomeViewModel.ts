import { useNavigation } from "@react-navigation/native";
import { Party } from "../../types/Party";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { useEffect, useState } from "react";
import { getDrawResultByGiverProfileId } from "../../services/cloud/DrawResult/DrawResultDb";
import { getPartyParticipantByUserIdAndPartyId } from "../../services/cloud/PartyParticipant/PartyParticipantDb";
import { getPartiesByUserId } from "../../services/cloud/Party/PartyDb";

export function useHomeViewModel() {
  const navigation = useNavigation<any>();
  const { usuarioAtual } = useAuth();
  const [parties, setParties] = useState<Party[]>([]);

  const [hideFinished, setHideFinished] = useState(false);

  useEffect(() => {
    async function loadParties() {
      if (!usuarioAtual?.id) {
        return;
      }
      try {
        const result = await getPartiesByUserId(usuarioAtual.id);
        const sortedParties = result.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
        setParties(sortedParties);
      } catch (error) {
        console.error("Erro ao carregar parties:", error);
      }
    }
    loadParties();
  }, [usuarioAtual]);

  const visibleParties = hideFinished
    ? parties.filter(party => new Date(party.event_date).getTime() >= Date.now())
    : parties;

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
            navigation.navigate("PerfilSorteado", { idPerfil: draw.receiver_profile_id });
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
    handleCardPress,
    handleCreateParty,
    handleScanPress,
    userName: usuarioAtual?.nome || "Visitante",
  };
};