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

  it('deve retornar os dados corretamente', () => {
    (calcularIdade as jest.Mock).mockReturnValue(25);

    const { result } = renderHook(() =>
      usePerfilSorteadoHeaderViewModel(mockProps)
    );

    expect(result.current.nome).toBe('João Silva');
    expect(result.current.fotoUrl).toBe(mockProps.fotoUrl);
    expect(result.current.genero).toBe('Masculino');
    expect(result.current.idade).toBe(25);
  });

  it('deve chamar calcularIdade com a data correta', () => {
    (calcularIdade as jest.Mock).mockReturnValue(25);

    renderHook(() =>
      usePerfilSorteadoHeaderViewModel(mockProps)
    );

    expect(calcularIdade).toHaveBeenCalledWith('2000-01-01');
  });

  it('deve atualizar idade quando data de nascimento muda', () => {
    (calcularIdade as jest.Mock)
      .mockReturnValueOnce(25)
      .mockReturnValueOnce(30);

    const { result, rerender } = renderHook(
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