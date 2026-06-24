import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePartyDrawRestrictionsViewModel } from "./PartyDrawRestrictionsViewModel";
import { getPartyFromCloud, updatePartyDependentDrawFlagInCloud } from "../../services/cloud/Party/PartyDb";
import { getDrawRestrictionsByPartyFromCloud, createDrawRestrictionInCloud, deleteDrawRestrictionFromCloud } from "../../services/cloud/DrawRestriction/DrawRestrictionDb";

const mockPartyId = "party-123";

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({
    params: { partyId: mockPartyId },
  }),
}));

jest.mock("../../services/cloud/Party/PartyDb", () => ({
  getPartyFromCloud: jest.fn(),
  updatePartyDependentDrawFlagInCloud: jest.fn(),
}));

jest.mock("../../services/cloud/DrawRestriction/DrawRestrictionDb", () => ({
  getDrawRestrictionsByPartyFromCloud: jest.fn(),
  createDrawRestrictionInCloud: jest.fn(),
  deleteDrawRestrictionFromCloud: jest.fn(),
}));

jest.mock("../../services/cloud/PartyParticipant/PartyParticipantDb", () => ({
  getParticipantsByPartyId: jest.fn(() => Promise.resolve([
    { perfil: { id: "user-1", participant_name: "Alice" } },
    { perfil: { id: "user-2", participant_name: "Bob" } },
  ])),
}));

const mockGetPartyFromCloud = getPartyFromCloud as jest.Mock;
const mockUpdatePartyDependentDrawFlagInCloud = updatePartyDependentDrawFlagInCloud as jest.Mock;
const mockGetDrawRestrictionsByPartyFromCloud = getDrawRestrictionsByPartyFromCloud as jest.Mock;
const mockCreateDrawRestrictionInCloud = createDrawRestrictionInCloud as jest.Mock;
const mockDeleteDrawRestrictionFromCloud = deleteDrawRestrictionFromCloud as jest.Mock;

describe("usePartyDrawRestrictionsViewModel", () => {
  const mockPartyResponse = {
    id: "party-123",
    name: "Festa de Teste",
    block_dependent_draw: true,
  };

  const mockCloudRestrictions = [
    {
      id: "restriction-cloud-id",
      party_id: "party-123",
      person_a_id: "user-1",
      person_b_id: "user-2",
      direction: "one_way",
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPartyFromCloud.mockResolvedValue(mockPartyResponse);
    mockGetDrawRestrictionsByPartyFromCloud.mockResolvedValue(mockCloudRestrictions);
    mockCreateDrawRestrictionInCloud.mockResolvedValue("new-generated-id");
    mockDeleteDrawRestrictionFromCloud.mockResolvedValue(undefined);
    mockUpdatePartyDependentDrawFlagInCloud.mockResolvedValue(undefined);
  });

  it("deve inicializar com os estados corretos e carregar dados assíncronos da nuvem", async () => {
    const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

    expect(result.current.personA).toBe("");
    expect(result.current.personB).toBe("");
    expect(result.current.restrictionDirection).toBe("one_way");
    expect(result.current.RestrictionDirectionButtonTitle).toBe("Não pode tirar");

    await waitFor(() => {
      expect(result.current.participantsOptions).toEqual([
        { key: "Alice", label: "Alice", value: "user-1" },
        { key: "Bob", label: "Bob", value: "user-2" },
      ]);
      expect(mockGetPartyFromCloud).toHaveBeenCalledWith(mockPartyId);
      expect(mockGetDrawRestrictionsByPartyFromCloud).toHaveBeenCalledWith(mockPartyId);
      expect(result.current.blockDependentDraw).toBe(true);
      expect(result.current.BlockDependentDrawButtonTitle).toBe("Permitir que Titulares e seus Dependentes se tirem");
      expect(result.current.restrictionsList).toHaveLength(1);
      expect(result.current.restrictionsList[0]).toMatchObject({
        id: "restriction-cloud-id",
        personAName: "Alice",
        personBName: "Bob",
        restrictionDirection: "one_way",
      });
    });
  });

  it("deve alternar a direção da restrição (one_way / both_ways)", async () => {
    const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

    expect(result.current.restrictionDirection).toBe("one_way");

    act(() => {
      result.current.handleChangeRestrictionDirection();
    });

    expect(result.current.restrictionDirection).toBe("both_ways");
    expect(result.current.RestrictionDirectionButtonTitle).toBe("Não podem se tirar");
  });

  it("deve alternar o bloqueio de sorteio de dependentes e salvar no banco", async () => {
    const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

    await waitFor(() => expect(result.current.blockDependentDraw).toBe(true));

    await act(async () => {
      await result.current.handleToggleBlockDependentDraw();
    });

    expect(mockUpdatePartyDependentDrawFlagInCloud).toHaveBeenCalledWith(mockPartyId, false);
    expect(result.current.blockDependentDraw).toBe(false);
    expect(result.current.BlockDependentDrawButtonTitle).toBe("Impedir que Titulares e seus Dependentes se tirem");
  });

  describe("handleCreateRestriction", () => {
    it("não deve criar restrição se personA ou personB estiverem vazios", async () => {
      const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

      await act(async () => {
        await result.current.handleCreateRestriction();
      });

      expect(mockCreateDrawRestrictionInCloud).not.toHaveBeenCalled();
    });

    it("não deve criar restrição se personA for igual a personB", async () => {
      const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

      act(() => {
        result.current.setPersonA("user-1");
        result.current.setPersonB("user-1");
      });

      await act(async () => {
        await result.current.handleCreateRestriction();
      });

      expect(mockCreateDrawRestrictionInCloud).not.toHaveBeenCalled();
    });

    it("deve criar uma restrição válida na nuvem e limpar os inputs de seleção", async () => {
      const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

      await waitFor(() => {
        expect(result.current.participantsOptions).toHaveLength(2);
      });

      act(() => {
        result.current.setPersonA("user-1");
        result.current.setPersonB("user-2");
      });

      await act(async () => {
        await result.current.handleCreateRestriction();
      });

      expect(mockCreateDrawRestrictionInCloud).toHaveBeenCalledWith({
        party_id: mockPartyId,
        person_a_id: "user-1",
        person_b_id: "user-2",
        direction: "one_way",
      });

      expect(result.current.personA).toBe("");
      expect(result.current.personB).toBe("");

      await waitFor(() => {
        expect(result.current.restrictionsList).toHaveLength(2); 
      });
    });
  });

  describe("handleDeleteRestriction", () => {
    it("deve deletar uma restrição da nuvem e removê-la da listagem local do estado", async () => {
      const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

      await waitFor(() => expect(result.current.restrictionsList).toHaveLength(1));

      await act(async () => {
        await result.current.handleDeleteRestriction("restriction-cloud-id");
      });

      expect(mockDeleteDrawRestrictionFromCloud).toHaveBeenCalledWith("restriction-cloud-id");
      expect(result.current.restrictionsList).toHaveLength(0);
    });
  });
});