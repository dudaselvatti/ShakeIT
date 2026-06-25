import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { useEffect, useMemo, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { PartyParticipant } from "../../types/PartyParticipant";
import { RestrictionDirection } from "../../types/DrawRestriction";
import { Party } from "../../types/Party";
import { getPartyFromCloud, updatePartyDependentDrawFlagInCloud} from "../../services/cloud/Party/PartyDb";
import { getDrawRestrictionsByPartyFromCloud, createDrawRestrictionInCloud, deleteDrawRestrictionFromCloud } from "../../services/cloud/DrawRestriction/DrawRestrictionDb";
import { DrawRestrictionCreationDTO } from "../../dto/DrawRestriction/DrawRestrictionCreationDTO";
import { getParticipantsByPartyId } from "../../services/cloud/PartyParticipant/PartyParticipantDb";

type RouteParams = {
  partyId: string;
};

type SelectOption = {
  key: string;
  label: string;
  value: string;
};

type restrictionsListProps = {
  id: string;
  personAName: string;
  personBName: string;
  restrictionDirection: RestrictionDirection;
  onPress: () => void;
};

export function usePartyDrawRestrictionsViewModel() {
  const route = useRoute();
  const { partyId } = route.params as RouteParams;

  const [party, setParty] = useState<Party | null>(null);
  const [participants, setParticipants] = useState<PartyParticipant[]>([]);
  const [restrictionsList, setRestrictionsList] = useState<restrictionsListProps[]>([]);
  const [personA, setPersonA] = useState("");
  const [personB, setPersonB] = useState("");
  const [restrictionDirection, setRestrictionDirection] = useState<RestrictionDirection>("one_way");
  const [blockDependentDraw, setBlockDependentDraw] = useState(false);
  const [isClearModalVisible, setClearModalVisible] = useState(false);

  useEffect(() => {
    async function fetchParty() {
      try {
        const cloudParty = await getPartyFromCloud(partyId);
        if (cloudParty) {
          setParty(cloudParty);
        } else {
          console.warn(`Festa com o ID ${partyId} não foi encontrada no banco.`);
        }
      } catch (error) {
        console.error("Erro ao buscar a festa no Firestore:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
      }
    }

    if (partyId) {
      fetchParty();
    }
  }, [partyId]);

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const partyParticipants = await getParticipantsByPartyId(partyId);
        setParticipants(partyParticipants);
      } catch (error) {
        console.error("Erro ao buscar participantes no Firestore:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
      }
    }

    if (partyId) {
      fetchParticipants();
    }
  }, [partyId]);

  const participantsOptions: SelectOption[] = useMemo(() => {
    return participants.map((p) => ({
      key: p.perfil.participant_name,
      label: p.perfil.participant_name,
      value: p.perfil.id,
    }));
  }, [participants]);

  const participantsMap = useMemo(() => {
    const map = new Map<string, PartyParticipant>();

    participants.forEach((p) => {
      map.set(p.perfil.id, p);
    });

    return map;
  }, [participants]);

  useEffect(() => {
    async function fetchRestrictions() {
      if (!partyId || participants.length === 0) return;

      try {
        const cloudRestrictions = await getDrawRestrictionsByPartyFromCloud(partyId);
        
        const formattedRestrictions = cloudRestrictions.map((restriction) => {
          const participantA = participantsMap.get(restriction.person_a_id);
          const participantB = participantsMap.get(restriction.person_b_id);

          return {
            id: restriction.id,
            personAName: participantA?.perfil.participant_name || "Desconhecido",
            personBName: participantB?.perfil.participant_name || "Desconhecido",
            restrictionDirection: restriction.direction,
            onPress: () => handleDeleteRestriction(restriction.id),
          };
        });

        setRestrictionsList(formattedRestrictions);
      } catch (error) {
        console.error("Erro ao carregar restrições da nuvem:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
      }
    }

    fetchRestrictions();
  }, [partyId, participants, participantsMap]);

  function handleChangeRestrictionDirection() {
    setRestrictionDirection((prev) =>
      prev === "one_way" ? "both_ways" : "one_way"
    );
  }

  async function handleCreateRestriction() {
    if (!personA || !personB) return;
    if (personA === personB) return;

    try {
      const restrictionData: DrawRestrictionCreationDTO = {
        party_id: partyId,
        person_a_id: personA,
        person_b_id: personB,
        direction: restrictionDirection,
      };

      const generatedId = await createDrawRestrictionInCloud(restrictionData);

      const participantA = participantsMap.get(personA);
      const participantB = participantsMap.get(personB);

      if (!participantA || !participantB) return;

      const newRestrictionListElement: restrictionsListProps = {
        id: generatedId,
        personAName: participantA.perfil.participant_name,
        personBName: participantB.perfil.participant_name,
        restrictionDirection: restrictionDirection,
        onPress: () => handleDeleteRestriction(generatedId),
      };

      setRestrictionsList((prev) => [...prev, newRestrictionListElement]);

      setPersonA("");
      setPersonB("");
    } catch (error) {
      console.error("Erro ao salvar restrição manual:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
    }
  }

  async function handleDeleteRestriction(RestrictionId: string) {
    try {
      await deleteDrawRestrictionFromCloud(RestrictionId);
      setRestrictionsList((prev) => prev.filter((item) => item.id !== RestrictionId));
    } catch (error) {
      console.error("Erro ao deletar restrição na nuvem:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
    }
  }

  const handleClearAllRestrictions = () => {
    setClearModalVisible(true);
  };

  const cancelClearAll = () => {
    setClearModalVisible(false);
  };

  const confirmClearAll = async () => {
    setClearModalVisible(false);
    try {
      // Deletar todas as restrições individuais
      for (const restriction of restrictionsList) {
        await deleteDrawRestrictionFromCloud(restriction.id);
      }
      
      // Limpar a flag de dependentes (se estiver ativa)
      if (blockDependentDraw) {
        await updatePartyDependentDrawFlagInCloud(partyId, false);
        setBlockDependentDraw(false);
      }

      setRestrictionsList([]);
      Toast.show({ type: "success", text1: "Sucesso", text2: "Todas as restrições foram limpas." });
    } catch (error) {
      console.error("Erro ao limpar restrições na nuvem:", error);
      Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
    }
  };

  useEffect(() => {
    if (party) {
      setBlockDependentDraw(party.block_dependent_draw);
    }
  }, [party]);

  async function handleToggleBlockDependentDraw() {
  const newValue = !blockDependentDraw;

  try {
    await updatePartyDependentDrawFlagInCloud(partyId, newValue);

    setBlockDependentDraw(newValue);
    setParty((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        block_dependent_draw: newValue,
      };
    });
  } catch (error) {
    console.error("Erro ao atualizar a flag global de dependentes na nuvem:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
  }
}

  const RestrictionDirectionButtonTitle =
    restrictionDirection === "one_way" ? "Não pode tirar" : "Não podem se tirar";

  const BlockDependentDrawButtonTitle = blockDependentDraw
  ? "Permitir que Titulares e seus Dependentes se tirem"
  : "Impedir que Titulares e seus Dependentes se tirem";

  return {
    participantsOptions,
    restrictionsList,
    personA,
    personB,
    setPersonA,
    setPersonB,
    restrictionDirection,
    handleChangeRestrictionDirection,
    RestrictionDirectionButtonTitle,
    handleCreateRestriction,
    handleDeleteRestriction,
    blockDependentDraw,
    BlockDependentDrawButtonTitle,
    handleToggleBlockDependentDraw,
    isClearModalVisible,
    handleClearAllRestrictions,
    cancelClearAll,
    confirmClearAll,
  };
}