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

  useEffect(() => {
    async function loadParties() {
      if (!usuarioAtual?.id) {
        return;
      }
      try {
        const result = await getPartiesByUserId(usuarioAtual.id);
        setParties(result);
      } catch (error) {
        console.error("Erro ao carregar parties:", error);
      }
    }
    loadParties();
  }, [usuarioAtual]);

  const handleCardPress = async (party: Party) => {
    switch (party.status) {
      case "aguardando_sorteio":
        navigation.navigate("PartyAdmin", {
          partyId: party.id,
        });
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
          const draw = await getDrawResultByGiverProfileId(party.id, participant.perfil.id);
          if (!draw) {
            throw new Error("Sorteio não encontrado");
          }
          navigation.navigate( "PerfilSorteado", { idPerfil: draw.receiver_profile_id });
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
    parties,
    handleCardPress,
    handleCreateParty,
    handleScanPress,
    userName: usuarioAtual?.nome || "Visitante",
  };
};