import React from 'react';
import { Image } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ImagePicker } from './index';
import { useImagePickerViewModel } from './ImagePickerViewModel';

jest.mock('./ImagePickerViewModel', () => ({
  useImagePickerViewModel: jest.fn(),
}));

describe('Componente ImagePicker', () => {
  const mockHandlePickImage = jest.fn();
  const mockOnChangeImage = jest.fn();

  const defaultProps = {
    label: 'Profile Photo',
    onChangeImage: mockOnChangeImage,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o placeholder quando nenhuma imagem foi providenciada', () => {
    (useImagePickerViewModel as jest.Mock).mockReturnValue({
      label: 'Profile Photo',
      value: null,
      containerStyle: {},
      handlePickImage: mockHandlePickImage,
    });

    const { getByText, queryByRole } = render(<ImagePicker {...defaultProps} />);

    expect(getByText('Profile Photo')).toBeTruthy();
    expect(getByText('Selecionar Foto')).toBeTruthy();
    
    expect(queryByRole('image')).toBeNull();
  });

  it('renderiza a imagem quando um valor de URI é providenciado', () => {
    const mockUri = 'https://example.com/photo.jpg';
    
    (useImagePickerViewModel as jest.Mock).mockReturnValue({
      label: 'Profile Photo',
      value: mockUri,
      containerStyle: {},
      handlePickImage: mockHandlePickImage,
    });

    const { getByText, queryByText, UNSAFE_getByType } = render(<ImagePicker {...defaultProps} />);

    expect(getByText('Profile Photo')).toBeTruthy();
    expect(queryByText('Selecionar Foto')).toBeNull();

    const imageComponent = UNSAFE_getByType(Image);
    expect(imageComponent.props.source).toEqual({ uri: mockUri });
  });

  it('chama handlePickImage quando o touchable é pressionado', () => {
    (useImagePickerViewModel as jest.Mock).mockReturnValue({
      label: 'Profile Photo',
      value: null,
      containerStyle: {},
      handlePickImage: mockHandlePickImage,
    });

    const { getByText } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByText('Selecionar Foto');
    fireEvent.press(touchable);

    expect(mockHandlePickImage).toHaveBeenCalledTimes(1);
  });
});