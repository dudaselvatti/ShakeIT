import React from 'react';
import { render } from '@testing-library/react-native';
import { PerfilSorteadoScreen } from './index';
import { usePerfilSorteadoViewModel } from './PerfilSorteadoViewModel';

jest.mock('expo-screen-capture', () => ({
  addScreenshotListener: jest.fn(() => ({ remove: jest.fn() })),
  preventScreenCaptureAsync: jest.fn(),
  allowScreenCaptureAsync: jest.fn(),
}));



jest.mock('./PerfilSorteadoViewModel');

jest.mock('./components/PerfilSorteadoHeader', () => ({
  __esModule: true,
  PerfilSorteadoHeader: jest.fn(() => null),
}));

jest.mock('./components/PerfilSorteadoContent', () => ({
  __esModule: true,
  PerfilSorteadoContent: jest.fn(() => null),
}));

describe('Screen: PerfilSorteado', () => {
  const mockParticipante = {
    usuario: {
      avatar_url: 'https://github.com/usuario.png',
      nome: 'Amigo Secreto',
      birth_date: '1995-05-15',
      genero: 'Feminino',
    },
    perfil: {
      sizes: {
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
      tabs: [
        {
          key: '1',
          label: 'Eu',
          type: 'receiver',
          participant: mockParticipante
        }
      ],
      activeTabKey: '1',
      setActiveTabKey: jest.fn(),
      isLoading: false,
      handleRevealAll: jest.fn(),
    });
  });

  it('deve renderizar corretamente e passar as props para os componentes filhos', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PerfilSorteadoHeader } = require('./components/PerfilSorteadoHeader');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PerfilSorteadoContent } = require('./components/PerfilSorteadoContent');

    render(<PerfilSorteadoScreen />);

    expect(PerfilSorteadoHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: mockParticipante.usuario.nome,
        fotoUrl: mockParticipante.usuario.avatar_url,
        dataDeNascimento: mockParticipante.usuario.birth_date,
        genero: mockParticipante.usuario.genero,
      }),
      undefined
    );

    expect(PerfilSorteadoContent).toHaveBeenCalledWith(
      expect.objectContaining({
        medidas: mockParticipante.perfil.sizes,
        preferencias: mockParticipante.perfil.preferencias,
      }),
      undefined
    );
  });
});