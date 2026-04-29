import { renderHook } from '@testing-library/react-native';
import { usePerfilSorteadoHeaderViewModel } from './PerfilSorteadoHeaderViewModel';
import { calcularIdade } from '../../utils/Usuario/calcularIdade';

jest.mock('../../utils/Usuario/calcularIdade', () => ({
  calcularIdade: jest.fn(),
}));

describe('usePerfilSorteadoHeaderViewModel', () => {
  const mockProps = {
    fotoUrl: 'https://example.com/foto.jpg',
    nome: 'João Silva',
    dataDeNascimento: '2000-01-01',
    genero: 'Masculino',
  };

  it('deve atualizar idade quando data de nascimento muda', () => {
    (calcularIdade as jest.Mock)
      .mockReturnValueOnce(25)
      .mockReturnValueOnce(30);

    const { result, rerender } = renderHook<typeof mockProps, ReturnType<typeof usePerfilSorteadoHeaderViewModel>>(
      (props) => usePerfilSorteadoHeaderViewModel(props),
      {
        initialProps: mockProps,
      }
    );

    expect(result.current.idade).toBe(25);

    rerender({
      ...mockProps,
      dataDeNascimento: '1990-01-01',
    });

    expect(calcularIdade).toHaveBeenCalledWith('1990-01-01');
    expect(result.current.idade).toBe(30);
  });
});