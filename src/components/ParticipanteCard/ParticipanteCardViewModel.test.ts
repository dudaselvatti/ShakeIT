import { renderHook } from "@testing-library/react-native";
import { useParticipanteCardViewModel, Props } from "./ParticipanteCardViewModel";
import { Participante } from '../../types/Participante';

describe("useParticipanteCardViewModel", () => {
  const mockParticipanteBase: Participante = {
      usuario: {
          id: 101,
          email: 'zeninguem@email.com',
          senha: '12345',
          nome: 'Zé ninguém',
          fotoUrl: "https://i.pravatar.cc/150?img=1",
          genero: "Masculino",
          dataDeNascimento: "2003-12-01"
      },
      perfil: {
          idUsuario: 101,
          isConfirmado: false,
          medidas: {
              camisa: "M",
              calca: "42",
              calcado: "43"
          },
          preferencias: {
              coisasQueAmo: ["Nada"],
              melhorEvitar: ["Tudo"]
          },
          isDependente: false
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
      perfil: { isConfirmado: false },
    };

    const { result } = renderHook(() =>
      useParticipanteCardViewModel({ participante: participantePendente as any })
    );

    expect(result.current.isConfirmado).toBe(false);
    expect(result.current.statusIcon).toBe("🔓");
    expect(result.current.statusText).toBe("Pendente");
  });

  it("deve retornar o estado correto para um participante CONFIRMADO", () => {
    const participanteConfirmado = {
      ...mockParticipanteBase,
      perfil: { isConfirmado: true },
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
        perfil: { ...mockParticipanteBase.perfil, isConfirmado: true },
      } as any,
    });

    expect(result.current.isConfirmado).toBe(true);
    expect(result.current.statusIcon).toBe("🔒");
  });
});