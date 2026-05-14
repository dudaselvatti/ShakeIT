import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useState } from "react";
import { RootStackParamList } from "../../../App";
import { Party } from "../../types/Party";

// Mock data to simulate the party fetched via code
const MOCK_PARTY: Party = {
  id: "mock1",
  name: "Firma 2026",
  minPrice: 50,
  maxPrice: 100,
  idAdmin: 1,
  inviteCode: "#NATAL55",
  eventDate: "2026-12-20T00:00:00.000Z",
  status: "Aguardando Sorteio",
};

type PartyPreviewRouteProp = RouteProp<RootStackParamList, 'PartyPreview'>;

export function usePartyPreviewViewModel() {
  const navigation = useNavigation<any>();
  const route = useRoute<PartyPreviewRouteProp>();
  
  const [isModalVisible, setModalVisible] = useState(false);
  
  const party = MOCK_PARTY;

  const handleBackPress = () => {
    setModalVisible(true);
  };

  const handleCancelModal = () => {
    setModalVisible(false);
  };

  const handleConfirmModal = () => {
    setModalVisible(false);
    // Aguarda o modal nativo desmontar antes de navegar para não travar os toques na Home
    setTimeout(() => {
      navigation.navigate("Home");
    }, 100);
  };

  const handleReady = () => {
    navigation.navigate("ParticipantLobby", { partyId: party.id });
  };

  return {
    party,
    isModalVisible,
    handleBackPress,
    handleCancelModal,
    handleConfirmModal,
    handleReady,
  };
}
