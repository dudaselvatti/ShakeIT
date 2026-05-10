import { usePerfilSorteadoContentViewModel, Props } from './PerfilSorteadoContentViewModel';
import { Medidas, Preferencias } from '../../types/Perfil';

describe('usePerfilSorteadoContentViewModel', () => {
  const mockMedidas: Medidas = {
    camisa: 'M',
    calca: '40',
    calcado: '42',
  };

  const mockPreferencias: Preferencias = {
    coisasQueAmo: ['Tecnologia', 'Livros'],
    melhorEvitar: ['Perfume', 'Chocolate'],
  };

  const mockProps: Props = {
    medidas: mockMedidas,
    preferencias: mockPreferencias,
  };

  it('deve retornar as medidas e preferências exatamente como fornecidas nas props', () => {
    const result = usePerfilSorteadoContentViewModel(mockProps);

    expect(result.medidas).toEqual(mockMedidas);
    expect(result.preferencias).toEqual(mockPreferencias);
  });

  it('deve manter a estrutura correta dos objetos', () => {
    const { medidas, preferencias } =
      usePerfilSorteadoContentViewModel(mockProps);

    expect(medidas.camisa).toBe('M');
    expect(preferencias.coisasQueAmo).toContain('Tecnologia');
  });
});