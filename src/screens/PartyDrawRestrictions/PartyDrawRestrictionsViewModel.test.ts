import { renderHook, act } from '@testing-library/react-native';
import { usePartyDrawRestrictionsViewModel } from "./PartyDrawRestrictionsViewModel";

const mockPartyId = "party-123";
jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({
    params: { partyId: mockPartyId },
  }),
}));

jest.mock("../../mocks/partiesMock", () => ({
  partiesMock: [
    { id: "party-123", block_dependent_draw: true },
    { id: "party-456", block_dependent_draw: false },
  ],
}));

jest.mock("../../mocks/participantesMock", () => ({
  participantesMock: [
    { perfil: { id: "user-1", participant_name: "Alice" } },
    { perfil: { id: "user-2", participant_name: "Bob" } },
  ],
}));

describe("usePartyDrawRestrictionsViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve inicializar com os estados corretos baseados nos mocks", () => {
    const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

    expect(result.current.participantsOptions).toEqual([
      { key: "Alice", label: "Alice", value: "user-1" },
      { key: "Bob", label: "Bob", value: "user-2" },
    ]);

    expect(result.current.personA).toBe("");
    expect(result.current.personB).toBe("");
    expect(result.current.restrictionsList).toEqual([]);
    expect(result.current.restrictionDirection).toBe("one_way");
    expect(result.current.blockDependentDraw).toBe(true);
    expect(result.current.RestrictionDirectionButtonTitle).toBe("Não pode tirar");
    expect(result.current.BlockDependentDrawButtonTitle).toBe(
      "Impedir que Titulares e seus Dependentes se tirem"
    );
  });

  it("deve alternar a direção da restrição (one_way / both_ways)", () => {
    const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

    expect(result.current.restrictionDirection).toBe("one_way");
    expect(result.current.RestrictionDirectionButtonTitle).toBe("Não pode tirar");

    act(() => {
      result.current.handleChangeRestrictionDirection();
    });

    expect(result.current.restrictionDirection).toBe("both_ways");
    expect(result.current.RestrictionDirectionButtonTitle).toBe("Não podem se tirar");
  });

  it("deve alternar o bloqueio de sorteio de dependentes", () => {
    const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

    expect(result.current.blockDependentDraw).toBe(true);

    act(() => {
      result.current.handleToggleBlockDependentDraw();
    });

    expect(result.current.blockDependentDraw).toBe(false);
    expect(result.current.BlockDependentDrawButtonTitle).toBe(
      "Permitir que Titulares e seus Dependentes se tirem"
    );
  });

  describe("handleCreateRestriction", () => {
    it("não deve criar restrição se personA ou personB estiverem vazios", () => {
      const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

      act(() => {
        result.current.handleCreateRestriction();
      });

      expect(result.current.restrictionsList).toHaveLength(0);
    });

    it("não deve criar restrição se personA for igual a personB", () => {
      const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

      act(() => {
        result.current.setPersonA("user-1");
        result.current.setPersonB("user-1");
      });

      act(() => {
        result.current.handleCreateRestriction();
      });

      expect(result.current.restrictionsList).toHaveLength(0);
    });

    it("deve criar uma restrição válida e limpar os inputs de seleção", () => {
      const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

      act(() => {
        result.current.setPersonA("user-1");
        result.current.setPersonB("user-2");
      });

      act(() => {
        result.current.handleCreateRestriction();
      });

      expect(result.current.restrictionsList).toHaveLength(1);
      expect(result.current.restrictionsList[0]).toMatchObject({
        personAName: "Alice",
        personBName: "Bob",
        restrictionDirection: "one_way",
      });

      expect(result.current.personA).toBe("");
      expect(result.current.personB).toBe("");
    });
  });

  it("deve chamar handleDeleteRestriction sem quebrar (mesmo que não implementado ainda)", () => {
    const { result } = renderHook(() => usePartyDrawRestrictionsViewModel());

    expect(() => {
      act(() => {
        result.current.handleDeleteRestriction("algum-id");
      });
    }).not.toThrow();
  });
});