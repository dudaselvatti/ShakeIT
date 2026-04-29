import React from 'react';
import { render } from '@testing-library/react-native';
import { PerfilSorteado } from './index';

jest.mock('../../components/PerfilSorteadoHeader', () => ({
  __esModule: true,
  PerfilSorteadoHeader: jest.fn(() => null),
}));

jest.mock('../../components/PerfilSorteadoContent', () => ({
  __esModule: true,
  PerfilSorteadoContent: jest.fn(() => null),
}));

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    ScrollView: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

describe('Screen: PerfilSorteado', () => {
  const mockData = {
    fotoUrl: 'https://github.com/usuario.png',
    nome: 'Amigo Secreto',
    dataDeNascimento: '1995-05-15',
    genero: 'Feminino',
    medidas: {
      camisa: 'P',
      calca: '38',
      calcado: '36',
    },
    preferencias: {
      coisasQueAmo: ['Livros'],
      melhorEvitar: ['Doces'],
    },
  };

  it('deve renderizar corretamente e passar as props para os componentes filhos', () => {
    const { PerfilSorteadoHeader } = require('../../components/PerfilSorteadoHeader');
    const { PerfilSorteadoContent } = require('../../components/PerfilSorteadoContent');

    render(<PerfilSorteado {...mockData} />);

    expect(PerfilSorteadoHeader).toHaveBeenCalledWith(
        expect.objectContaining({
            nome: mockData.nome,
            fotoUrl: mockData.fotoUrl,
            dataDeNascimento: mockData.dataDeNascimento,
            genero: mockData.genero,
        }),
        undefined
        );

    expect(PerfilSorteadoContent).toHaveBeenCalledWith(
        expect.objectContaining({
            medidas: mockData.medidas,
            preferencias: mockData.preferencias,
        }),
        undefined
        );
  });
});