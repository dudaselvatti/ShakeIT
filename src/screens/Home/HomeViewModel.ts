import { useNavigation } from "@react-navigation/native";
import { partiesMock } from "../../mocks/partiesMock";
import { Party } from "../../types/Party";
import { gerarPartyCode } from "../../utils/PartyCode/gerarPartyCode";
import { useAuth } from "../../contexts/AuthContext/AuthContext";

export function useHomeViewModel() {
  const navigation = useNavigation<any>();
  const { usuarioAtual } = useAuth();
  const parties = partiesMock;

  const handleCardPress = (party: Party) => {
    switch (party.status) {
      case "aguardando_sorteio":
        const partyCodeGerado = gerarPartyCode();
        navigation.navigate("PartyAdmin", {
          partyName: party.name,
          partyCode: partyCodeGerado,
        });
        break;
      case "sorteado":
          navigation.navigate("PerfilSorteado", { idUsuario: 1, });
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