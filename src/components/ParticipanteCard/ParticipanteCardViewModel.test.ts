import { renderHook } from "@testing-library/react-native";
import { useParticipanteCardViewModel, Props } from "./ParticipanteCardViewModel";
import { Participante } from '../../types/Participante';

describe("useParticipanteCardViewModel", () => {
  const mockParticipanteBase: Participante = {
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
    expect(result.current.statusIcon).toBe("🔓");
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
    expect(result.current.statusIcon).toBe("🔒");
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
    expect(result.current.statusIcon).toBe("🔒");
  });
});
