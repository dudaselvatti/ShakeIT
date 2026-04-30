import React from 'react';
import { render } from '@testing-library/react-native';
import { PerfilSorteadoContent } from './index';

const mockMedidas = {
  camisa: 'M',
  calca: '42',
  calcado: '40',
};

const mockPreferencias = {
  coisasQueAmo: ['Chocolate', 'Livros', 'Café'],
  melhorEvitar: ['Pimenta', 'Barulho'],
};

describe('PerfilSorteadoContent Component', () => {
  it('deve renderizar os títulos das seções corretamente', () => {
    const { getByText } = render(
      <PerfilSorteadoContent medidas={mockMedidas} preferencias={mockPreferencias} />
    );

    expect(getByText('Minhas Medidas')).toBeTruthy();
    expect(getByText('Minhas Preferências')).toBeTruthy();
  });

  it('deve renderizar as medidas do usuário corretamente', () => {
    const { getByText } = render(
      <PerfilSorteadoContent medidas={mockMedidas} preferencias={mockPreferencias} />
    );

    expect(getByText('Camisa: M')).toBeTruthy();
    expect(getByText('Calça: 42')).toBeTruthy();
    expect(getByText('Calçado: 40')).toBeTruthy();
  });

  it('deve renderizar a lista de coisas que o usuário ama', () => {
    const { getByText } = render(
      <PerfilSorteadoContent medidas={mockMedidas} preferencias={mockPreferencias} />
    );

    expect(getByText('Coisas que eu amo:')).toBeTruthy();
    mockPreferencias.coisasQueAmo.forEach((item) => {
      expect(getByText(item)).toBeTruthy();
    });
  });

  it('deve renderizar a lista de itens a evitar', () => {
    const { getByText } = render(
      <PerfilSorteadoContent medidas={mockMedidas} preferencias={mockPreferencias} />
    );

    expect(getByText('Melhor evitar:')).toBeTruthy();
    mockPreferencias.melhorEvitar.forEach((item) => {
      expect(getByText(item)).toBeTruthy();
    });
  });
});