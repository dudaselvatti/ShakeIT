import { renderHook } from "@testing-library/react-native";
import { useParticipanteCardViewModel, Props } from "./ParticipanteCardViewModel";
import { PartyParticipant } from '../../types/PartyParticipant';

describe("useParticipanteCardViewModel", () => {
  const mockParticipanteBase: PartyParticipant = {
      usuario: {
          id: "550e8400-e29b-41d4-a716-446655440101",
          email: 'zeninguem@email.com',
          nome: 'Zé ninguém',
          avatar_url: "https://i.pravatar.cc/150?img=1",
          genero: "Masculino",
          birth_date: "2003-12-01",
          shake_enabled: true,
          dark_mode: false,
          notifications_enabled: true,
          created_at: "2024-01-10T10:00:00Z",
          updated_at: "2024-01-10T10:00:00Z"
      },
      perfil: {
          id: "550e8400-e29b-41d4-a716-556655440101",
          user_id: "550e8400-e29b-41d4-a716-446655440101",
          party_id: "party-001",
          participant_type: "user",
          participant_name: "Zé ninguém",
          participant_avatar: "https://i.pravatar.cc/150?img=1",
          status: "pendente",
          has_revealed_draw: false,
          sizes: {
              camisa: "M",
              calca: "42",
              calcado: "43"
          },
          preferencias: {
              coisasQueAmo: ["Nada"],
              melhorEvitar: ["Tudo"]
          },
          created_at: "2024-01-10T10:00:00Z",
          updated_at: "2024-01-10T10:00:00Z"
      },
  };

  it("deve retornar o nome do participante corretamente", () => {
    const { result } = renderHook(() =>
      useParticipanteCardViewModel({ participante: mockParticipanteBase as any })
    );

    expect(result.current.nome).toBe("Zé ninguém");
  });

  it("deve retornar o estado correto para um participante PENDENTE", () => {
    const participantePendente = {
      ...mockParticipanteBase,
      perfil: { ...mockParticipanteBase.perfil, status: "pendente" },
    };

    const { result } = renderHook(() =>
      useParticipanteCardViewModel({ participante: participantePendente as any })
    );

    expect(result.current.isConfirmado).toBe(false);
    expect(result.current.statusIcon).toEqual(require('../../../assets/cadeado-aberto.png'));
    expect(result.current.statusText).toBe("pendente");
  });

  it("deve retornar o estado correto para um participante CONFIRMADO", () => {
    const participanteConfirmado = {
      ...mockParticipanteBase,
      perfil: { ...mockParticipanteBase.perfil, status: "confirmado" },
    };

    const { result } = renderHook(() =>
      useParticipanteCardViewModel({ participante: participanteConfirmado as any })
    );

    expect(result.current.isConfirmado).toBe(true);
    expect(result.current.statusIcon).toEqual(require('../../../assets/cadeado-fechado.png'));
    expect(result.current.statusText).toBe("");
  });

  it("deve reagir a mudanças no objeto participante", () => {
    const { result, rerender } = renderHook<any, Props>(
      ({ participante }) => useParticipanteCardViewModel({ participante }),
      {
        initialProps: { participante: mockParticipanteBase },
      }
    );

    expect(result.current.isConfirmado).toBe(false);

    rerender({
      participante: {
        ...mockParticipanteBase,
        usuario: { ...mockParticipanteBase.usuario, nome: "João Silva" },
        perfil: { ...mockParticipanteBase.perfil, status: "confirmado" },
      } as any,
    });

    expect(result.current.isConfirmado).toBe(true);
    expect(result.current.statusIcon).toEqual(require('../../../assets/cadeado-fechado.png'));
  });

  it("deve retornar o avatar padrao quando nao houver imagem e for usuario", () => {
    const participanteSemFoto = {
      ...mockParticipanteBase,
      perfil: { ...mockParticipanteBase.perfil, participant_avatar: "" },
      usuario: { ...mockParticipanteBase.usuario, avatar_url: "" }
    };
    const { result } = renderHook(() => useParticipanteCardViewModel({ participante: participanteSemFoto as any }));
    expect(result.current.avatarSource).toEqual(require('../../../assets/perfil-padrao.png'));
  });

  it("deve retornar o avatar de crianca quando for dependente do tipo child", () => {
    const dependenteCrianca = {
      ...mockParticipanteBase,
      perfil: { ...mockParticipanteBase.perfil, participant_type: "dependent", dependent_type: "child", participant_avatar: "" },
    };
    const { result } = renderHook(() => useParticipanteCardViewModel({ participante: dependenteCrianca as any }));
    expect(result.current.avatarSource).toEqual(require('../../../assets/crianca.png'));
  });

  it("deve retornar o avatar de pet quando for dependente do tipo pet", () => {
    const dependentePet = {
      ...mockParticipanteBase,
      perfil: { ...mockParticipanteBase.perfil, participant_type: "dependent", dependent_type: "pet", participant_avatar: "" },
    };
    const { result } = renderHook(() => useParticipanteCardViewModel({ participante: dependentePet as any }));
    expect(result.current.avatarSource).toEqual(require('../../../assets/pet.png'));
  });
});
