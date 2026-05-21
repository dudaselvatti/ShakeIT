import { renderHook } from '@testing-library/react-native';
import { usePartyCardViewModel, Props } from './PartyCardViewModel';
import { theme } from "../../styles/theme";

describe('usePartyCardViewModel', () => {
  const defaultProps: Props = {
    name: 'Festa de Natal',
    status: 'aguardando_sorteio',
    eventDate: '2024-12-02',
    onPress: jest.fn(),
  };

  it('deve retornar os dados básicos formatados corretamente', () => {
    const { result } = renderHook(() => usePartyCardViewModel(defaultProps));

    expect(result.current.title).toBe(defaultProps.name);
    expect(result.current.statusLabel).toBe(defaultProps.status);
    expect(result.current.eventDate).toBe(`Evento: ${defaultProps.eventDate}`);
    expect(result.current.onPress).toBe(defaultProps.onPress);
  });

  it('deve retornar a configuração correta para o status "sorteado"', () => {
    const props: Props = { ...defaultProps, status: 'sorteado' };
    const { result } = renderHook(() => usePartyCardViewModel(props));

    expect(result.current.statusIcon).toBe('gift');
    expect(result.current.tagColor).toBe(theme.colors.success);
  });

  it('deve retornar a configuração correta para o status "aguardando_sorteio"', () => {
    const props: Props = { ...defaultProps, status: 'aguardando_sorteio' };
    const { result } = renderHook(() => usePartyCardViewModel(props));

    expect(result.current.statusIcon).toBe('clock');
    expect(result.current.tagColor).toBe(theme.colors.primary);
  });

  it('deve retornar a configuração padrão (default) para outro status', () => {
    const props: Props = { ...defaultProps, status: 'aguardando_pessoas' as any };
    const { result } = renderHook(() => usePartyCardViewModel(props));

    expect(result.current.statusIcon).toBe('clock');
    expect(result.current.tagColor).toBe(theme.colors.primary);
  });

  it('deve memorizar os valores e atualizar apenas quando o status mudar', () => {
    const { result, rerender } = renderHook(
      (props: Props) => usePartyCardViewModel(props),
      { initialProps: defaultProps }
    );

    const firstValue = result.current;

    rerender(defaultProps);
    expect(result.current).toBe(firstValue);

    rerender({ ...defaultProps, status: 'sorteado' });
    expect(result.current).not.toBe(firstValue);
    expect(result.current.statusIcon).toBe('gift');
  });
});
