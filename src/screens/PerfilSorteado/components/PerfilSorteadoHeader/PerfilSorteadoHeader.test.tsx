import React from 'react';
import { render } from '@testing-library/react-native';
import { PerfilSorteadoHeader } from './index';
import { usePerfilSorteadoHeaderViewModel } from './PerfilSorteadoHeaderViewModel';

jest.mock('./PerfilSorteadoHeaderViewModel');

jest.mock('../../../../components/IconButton', () => ({
  IconButton: () => <></>
}));

describe('PerfilSorteadoHeader Component', () => {
  const mockProps = {
    fotoUrl: 'https://example.com/foto.jpg',
    nome: 'João Silva',
    dataDeNascimento: '1999-05-20',
    genero: 'Masculino',
  };

  const mockViewModelValues = {
    nome: 'João Silva',
    fotoUrl: 'https://example.com/foto.jpg',
    idade: '25',
    genero: 'Masculino',
    handleReturnHome: jest.fn(),
  };

  beforeEach(() => {
    (usePerfilSorteadoHeaderViewModel as jest.Mock).mockReturnValue(mockViewModelValues);
  });

  it('deve renderizar a marca (logo) corretamente', () => {
    const { getByText } = render(<PerfilSorteadoHeader {...mockProps} />);

    expect(getByText('SHAKE')).toBeTruthy();
    expect(getByText('IT')).toBeTruthy();
  });

  it('deve exibir o título da seção de amigo secreto', () => {
    const { getByText } = render(<PerfilSorteadoHeader {...mockProps} />);

    expect(getByText('Seu amigo secreto é')).toBeTruthy();
  });

  it('deve exibir o nome, idade e gênero provenientes do ViewModel', () => {
    const { getByText } = render(<PerfilSorteadoHeader {...mockProps} />);

    expect(getByText('João Silva')).toBeTruthy();
    expect(getByText('Idade: 25')).toBeTruthy();
    expect(getByText('Gênero: Masculino')).toBeTruthy();
  });

  it('deve renderizar a imagem de perfil com a URI correta', () => {
    const { getByTestId } = render(<PerfilSorteadoHeader {...mockProps} />);
    const image = getByTestId('profile-image');

    expect(image.props.source.uri).toBe('https://example.com/foto.jpg');
  });

  it('deve aplicar estilos de gênero corretamente (opcional)', () => {
    const { getByText } = render(<PerfilSorteadoHeader {...mockProps} />);
    const generoText = getByText('Gênero: Masculino');
    
    expect(generoText.props.style).toContainEqual({ marginLeft: 20 });
  });
});