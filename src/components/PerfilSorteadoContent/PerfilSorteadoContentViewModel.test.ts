import { usePerfilSorteadoContentViewModel, Props } from './PerfilSorteadoContentViewModel';
import { Medidas, Preferencias } from '../../types/Perfil';

describe('usePerfilSorteadoContentViewModel', () => {
  const mockMedidas: Medidas = {
    altura: 180,
    peso: 75,
  };

  const mockPreferencias: Preferencias = {
    estilo: 'Casual',
    corFavorita: 'Azul',
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

  it('deve manter a referência dos objetos ou a estrutura correta', () => {
    const { medidas, preferencias } = usePerfilSorteadoContentViewModel(mockProps);

    expect(medidas.altura).toBe(180);
    expect(preferencias.estilo).toBe('Casual');
  });
});