import Toast from 'react-native-toast-message';

import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Party } from "../../types/Party";
import { getPartyByInviteCodeFromCloud } from "../../services/cloud/Party/PartyDb";
import { createPartyParticipant, getPartyParticipantByUserIdAndPartyId } from "../../services/cloud/PartyParticipant/PartyParticipantDb";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { createNotification } from "../../services/cloud/Notification/NotificationDb";

type RouteParams = {
  partyCode: string;
};

export function usePartyPreviewViewModel() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { usuarioAtual } = useAuth();
  const { partyCode } = route.params as RouteParams;
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [isErrorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [party, setParty] = useState<Party | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadParty() {
      if (partyCode) {
        try {
          const fetchedParty = await getPartyByInviteCodeFromCloud(partyCode);
          if (!fetchedParty) {
            setErrorModalMessage("Código de convite inválido ou party não encontrada.");
            setErrorModalVisible(true);
            return;
          }
          setParty(fetchedParty);
        } catch (error) {
          console.error("Erro ao carregar party:", error);
          setErrorModalMessage("Sistema indisponível no momento.");
          setErrorModalVisible(true);
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
        if (party.admin_id !== usuarioAtual.id) {
          createNotification({
            user_id: party.admin_id,
            title: "Novo participante!",
            message: `${usuarioAtual.nome} quer entrar no evento ${party.name}`,
            type: 'party_join',
            related_party_id: party.id
          }).catch(console.error);
        }
      }
      navigation.navigate("ParticipantLobby", { partyId: party.id });
    } catch (error) {
      console.error("Erro ao entrar na party:", error);
      setErrorModalMessage("Erro ao tentar entrar na party. Verifique sua conexão e tente novamente.");
      setErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrorModalConfirm = () => {
    setErrorModalVisible(false);
    navigation.goBack();
  };

  return {
    party,
    isLoading,
    isModalVisible,
    isErrorModalVisible,
    errorModalMessage,
    handleBackPress,
    handleFooterNavigate,
    handleCancelModal,
    handleConfirmModal,
    handleErrorModalConfirm,
    handleReady,
  };
}
