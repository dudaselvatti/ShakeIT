import React from 'react';
import { render } from '@testing-library/react-native';
import { PerfilSorteadoScreen } from './index';
import { usePerfilSorteadoViewModel } from './PerfilSorteadoViewModel';

jest.mock('./PerfilSorteadoViewModel');

jest.mock('../../components/PerfilSorteadoHeader', () => ({
  __esModule: true,
  PerfilSorteadoHeader: jest.fn(() => null),
}));

jest.mock('../../components/PerfilSorteadoContent', () => ({
  __esModule: true,
  PerfilSorteadoContent: jest.fn(() => null),
}));

describe('Screen: PerfilSorteado', () => {
  const mockParticipante = {
    usuario: {
      fotoUrl: 'https://github.com/usuario.png',
      nome: 'Amigo Secreto',
      dataDeNascimento: '1995-05-15',
      genero: 'Feminino',
    },
    perfil: {
      medidas: {
        camisa: 'P',
        calca: '38',
        calcado: '36',
      },
      preferencias: {
        coisasQueAmo: ['Livros'],
        melhorEvitar: ['Doces'],
      },
    },
  };

  beforeEach(() => {
    (usePerfilSorteadoViewModel as jest.Mock).mockReturnValue({
      participante: mockParticipante,
    });
  });

  it('deve renderizar corretamente e passar as props para os componentes filhos', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PerfilSorteadoHeader } = require('../../components/PerfilSorteadoHeader');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PerfilSorteadoContent } = require('../../components/PerfilSorteadoContent');

    render(<PerfilSorteadoScreen />);

    expect(PerfilSorteadoHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: mockParticipante.usuario.nome,
        fotoUrl: mockParticipante.usuario.fotoUrl,
        dataDeNascimento: mockParticipante.usuario.dataDeNascimento,
        genero: mockParticipante.usuario.genero,
      }),
      undefined
    );

    expect(PerfilSorteadoContent).toHaveBeenCalledWith(
      expect.objectContaining({
        medidas: mockParticipante.perfil.medidas,
        preferencias: mockParticipante.perfil.preferencias,
      }),
      undefined
    );
  });
});