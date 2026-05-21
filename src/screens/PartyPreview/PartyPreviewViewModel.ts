import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useState } from "react";
import { RootStackParamList } from "../../../App";
import { Party } from "../../types/Party";

// Mock data to simulate the party fetched via code
const MOCK_PARTY: Party = {
  id: "mock1",
  name: "Firma 2026",
  min_value: 50,
  max_value: 100,
  admin_id: "550e8400-e29b-41d4-a716-446655440001",
  invite_code: "#NATAL55",
  event_date: "2026-12-20T00:00:00.000Z",
  status: "aguardando_sorteio",
  block_dependent_draw: false,
  allow_wishlist_changes_after_draw: true,
  created_at: "2024-01-10T10:00:00Z",
  updated_at: "2024-01-10T10:00:00Z"
};

type PartyPreviewRouteProp = RouteProp<RootStackParamList, 'PartyPreview'>;

export function usePartyPreviewViewModel() {
  const navigation = useNavigation<any>();
  const route = useRoute<PartyPreviewRouteProp>();
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  
  const party = MOCK_PARTY;

  const handleBackPress = () => {
    setPendingRoute(null);
    setModalVisible(true);
  };

  const handleFooterNavigate = (route: string) => {
    setPendingRoute(route);
    setModalVisible(true);
  };

  const handleCancelModal = () => {
    setModalVisible(false);
  };

  const handleConfirmModal = () => {
    setModalVisible(false);
    // Aguarda o modal nativo desmontar antes de navegar para não travar os toques na Home
    setTimeout(() => {
      if (pendingRoute) {
        navigation.navigate(pendingRoute);
      } else {
        navigation.navigate("Home");
      }
    }, 100);
  };

  const handleReady = () => {
    navigation.navigate("ParticipantLobby", { partyId: party.id });
  };

  return {
    party,
    isModalVisible,
    handleBackPress,
    handleFooterNavigate,
    handleCancelModal,
    handleConfirmModal,
    handleReady,
  };
}
