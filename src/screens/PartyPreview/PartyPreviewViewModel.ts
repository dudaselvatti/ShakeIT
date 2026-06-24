import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Party } from "../../types/Party";
import { getPartyByInviteCodeFromCloud } from "../../services/cloud/Party/PartyDb";
import { createPartyParticipant, getPartyParticipantByUserIdAndPartyId } from "../../services/cloud/PartyParticipant/PartyParticipantDb";
import { useAuth } from "../../contexts/AuthContext/AuthContext";

type RouteParams = {
  partyCode: string;
};

export function usePartyPreviewViewModel() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { usuarioAtual } = useAuth();
  const { partyCode } = route.params as RouteParams;
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [party, setParty] = useState<Party | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadParty() {
      if (partyCode) {
        try {
          const fetchedParty = await getPartyByInviteCodeFromCloud(partyCode);
          setParty(fetchedParty);
        } catch (error) {
          console.error("Erro ao carregar party:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadParty();
  }, [partyCode]);

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
    setTimeout(() => {
      if (pendingRoute) {
        navigation.navigate(pendingRoute);
      } else {
        navigation.navigate("Home");
      }
    }, 100);
  };

  const handleReady = async () => {
    if (!party || !usuarioAtual) return;
    
    setIsLoading(true);
    try {
      const existing = await getPartyParticipantByUserIdAndPartyId(usuarioAtual.id, party.id);
      if (!existing) {
        await createPartyParticipant(party.id, usuarioAtual, "pendente");
      }
      navigation.navigate("ParticipantLobby", { partyId: party.id });
    } catch (error) {
      console.error("Erro ao entrar na party:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    party,
    isLoading,
    isModalVisible,
    handleBackPress,
    handleFooterNavigate,
    handleCancelModal,
    handleConfirmModal,
    handleReady,
  };
}
