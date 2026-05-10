import { renderHook } from '@testing-library/react-native';
import { useAppHeaderViewModel, Props } from './AppHeaderViewModel';

describe('useAppHeaderViewModel', () => {
  it('deve retornar o título inicial corretamente', () => {
    const initialProps: Props = { headerTitle: 'Home' };
    
    const { result } = renderHook(() => useAppHeaderViewModel(initialProps));

    expect(result.current.title).toBe('Home');
  });

  it('deve atualizar o título quando a prop headerTitle mudar', () => {
    const initialProps: Props = { headerTitle: 'Perfil' };
    
    const { result, rerender } = renderHook(
      (p: Props) => useAppHeaderViewModel(p),
      { initialProps }
    );

    expect(result.current.title).toBe('Perfil');

    rerender({ headerTitle: 'Configurações' });
    expect(result.current.title).toBe('Configurações');
  });

  it('não deve alterar o título se a prop permanecer a mesma', () => {
    const props: Props = { headerTitle: 'Dashboard' };

    const { result, rerender } = renderHook(
      (p: Props) => useAppHeaderViewModel(p),
      { initialProps: props }
    );

    const firstValue = result.current.title;

    rerender({ headerTitle: 'Dashboard' });

    expect(result.current.title).toBe(firstValue);
  });
});