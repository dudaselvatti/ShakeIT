import React from 'react';
import { render } from '@testing-library/react-native';
import { PerfilSorteadoHeader } from './index';

jest.mock('./PerfilSorteadoHeaderViewModel', () => ({
  usePerfilSorteadoHeaderViewModel: jest.fn((props: Props) => ({
    nome: props.nome,
    fotoUrl: props.fotoUrl,
    idade: 25,
    genero: props.genero,
  })),
}));

describe('PerfilSorteadoHeader Component', () => {
  const mockProps = {
    fotoUrl: 'https://example.com/foto.jpg',
    nome: 'João Silva',
    dataDeNascimento: '2000-01-01',
    genero: 'Masculino',
  };

  it('deve renderizar a logo SHAKE IT corretamente', () => {
    const { getByText } = render(<PerfilSorteadoHeader {...mockProps} />);

    expect(getByText('SHAKE')).toBeTruthy();
    expect(getByText('IT')).toBeTruthy();
  });

  it('deve exibir o nome do amigo secreto corretamente', () => {
    const { getByText } = render(<PerfilSorteadoHeader {...mockProps} />);

    expect(getByText('Seu amigo secreto é')).toBeTruthy();
    expect(getByText('João Silva')).toBeTruthy();
  });

  it('deve exibir a idade e o gênero processados pelo ViewModel', () => {
    const { getByText } = render(<PerfilSorteadoHeader {...mockProps} />);

    expect(getByText('Idade: 25')).toBeTruthy();
    expect(getByText('Gênero: Masculino')).toBeTruthy();
  });

  it('deve carregar a imagem com a URL correta', () => {
    const { getByTestId } = render(<PerfilSorteadoHeader {...mockProps} />);

    const image = getByTestId('profile-image');

    expect(image.props.source.uri).toBe('https://example.com/foto.jpg');
  });
});