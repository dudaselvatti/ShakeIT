import { useEffect, useMemo, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Participante } from "../../types/Participante";
import { DrawRestriction, RestrictionDirection } from "../../types/DrawRestriction";
import { Party } from "../../types/Party";
import { partiesMock } from "../../mocks/partiesMock";
import { participantesMock } from "../../mocks/participantesMock";

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
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [restrictionsList, setRestrictionsList] = useState<restrictionsListProps[]>([]);
  const [personA, setPersonA] = useState("");
  const [personB, setPersonB] = useState("");
  const [restrictionDirection, setRestrictionDirection] = useState<RestrictionDirection>("one_way");
  const [blockDependentDraw, setBlockDependentDraw] = useState(true);

  useEffect(() => { //Tirar isto daqui durante a T32
    const foundParty = partiesMock.find(
      (party) => party.id === partyId
    );
    setParty(foundParty ?? null);
  }, [partyId]);

  useEffect(() => { //Tirar isto daqui durante a T32
    const partyParticipants = participantesMock;
    setParticipants(partyParticipants);
  }, [partyId]);

  const participantsOptions: SelectOption[] = useMemo(() => {
    return participants.map((p) => ({
      key: p.perfil.participant_name,
      label: p.perfil.participant_name,
      value: p.perfil.id,
    }));
  }, [participants]);

  const participantsMap = useMemo(() => {
    const map = new Map<string, Participante>();

    participants.forEach((p) => {
      map.set(p.perfil.id, p);
    });

    return map;
  }, [participants]);

  function handleChangeRestrictionDirection() {
    setRestrictionDirection((prev) =>
      prev === "one_way" ? "both_ways" : "one_way"
    );
  }

  function handleCreateRestriction() {
    if (!personA || !personB) return;
    if (personA === personB) return;

    const newRestriction: DrawRestriction = {
      id: String(Date.now()), //Tirar isto daqui durante a T32
      party_id: partyId,
      person_a_id: personA,
      person_b_id: personB,
      direction: restrictionDirection,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const participantA = participantsMap.get(personA);
    const participantB = participantsMap.get(personB);

    if (!participantA || !participantB) return;

    const newRestrictionListElement: restrictionsListProps = {
      id: newRestriction.id,
      personAName: participantA.perfil.participant_name,
      personBName: participantB.perfil.participant_name,
      restrictionDirection: newRestriction.direction,
      onPress: () => handleDeleteRestriction(newRestriction.id),
    };

    setRestrictionsList((prev) => [...prev, newRestrictionListElement]);

    setPersonA("");
    setPersonB("");
  }

  function handleDeleteRestriction(RestrictionId: string) {
    //Deverá ser implementado durante a T32, com uma função de deletar restrição do banco de dados
  }

  useEffect(() => {
    if (party) {
      setBlockDependentDraw(party.block_dependent_draw);
    }
  }, [party]);

  function handleToggleBlockDependentDraw() {
    setBlockDependentDraw((prev) => !prev);
    
    setParty((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        block_dependent_draw: !prev.block_dependent_draw,
      };
    });
  }

  const RestrictionDirectionButtonTitle =
    restrictionDirection === "one_way" ? "Não pode tirar" : "Não podem se tirar";

  const BlockDependentDrawButtonTitle =
    blockDependentDraw ? "Impedir que Titulares e seus Dependentes se tirem" : "Permitir que Titulares e seus Dependentes se tirem";

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
  };
}