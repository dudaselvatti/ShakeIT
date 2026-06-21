import { useNavigation } from "@react-navigation/native";
import { partiesMock } from "../../mocks/partiesMock";
import { participantesMock } from "../../mocks/participantesMock";
import { Party } from "../../types/Party";
import { useAuth } from "../../contexts/AuthContext/AuthContext";

export function useHomeViewModel() {
  const navigation = useNavigation<any>();
  const { usuarioAtual } = useAuth();
  const parties = partiesMock;

  const handleCardPress = (party: Party) => {
    switch (party.status) {
      case "aguardando_sorteio":
        navigation.navigate("PartyAdmin", {
          partyId: party.id,
        });
        break;
      case "sorteio_realizado":
        navigation.navigate("PerfilSorteado", { idUsuario: participantesMock[0].usuario.id });
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