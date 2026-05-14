import { useNavigation } from "@react-navigation/native";
import { partiesMock } from "../../mocks/partiesMock";
import { Party } from "../../types/Party";
import { gerarPartyCode } from "../../utils/PartyCode/gerarPartyCode";

export function useHomeViewModel() {
  const navigation = useNavigation<any>();
  const parties = partiesMock;

  const handleCardPress = (party: Party) => {
    switch (party.status) {
      case "Aguardando Sorteio":
        const partyCodeGerado = gerarPartyCode(); //partyCode é gerado aqui, porque ainda não o guardamos em memória
        navigation.navigate("PartyAdmin", {
          partyName: party.name,
          partyCode: partyCodeGerado, //partyCode: party.partyCode ou partyCode: party.code, futuramente (será preciso atualizar o type Party, também)
        });
        break;
      case "Sorteio Realizado":
      case "Fim do evento":
          navigation.navigate("PerfilSorteado", { idUsuario: 10, }); //Usa-se 11 como valor de teste, por enquanto
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
    userName: "Duda",
  };
};