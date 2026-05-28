import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ForgotMyPasswordScreen } from './index';
import { useForgotMyPasswordViewModel } from './ForgotMyPasswordViewModel';
import { TouchableOpacity, Text, View, TextInput } from 'react-native';

const MockTouchableOpacity = TouchableOpacity;
const MockText = Text;
const MockTextInput = TextInput;
const MockView = View;

jest.mock('./ForgotMyPasswordViewModel', () => ({
  useForgotMyPasswordViewModel: jest.fn(),
}));

jest.mock('../../components/Button', () => ({
  Button: ({ title, onPress }: any) => (
    <MockTouchableOpacity onPress={onPress}>
      <MockText>{title}</MockText>
    </MockTouchableOpacity>
  ),
}));

jest.mock('../../components/Input', () => ({
  Input: ({ value, onChangeText, placeholder }: any) => (
    <MockTextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  ),
}));

jest.mock('../../components/AppHeader', () => ({
  AppHeader: ({ headerTitle, onBackPress }: any) => (
    <MockView>
      <MockText>{headerTitle}</MockText>

      <MockTouchableOpacity
        testID="back-button"
        onPress={onBackPress}
      >
        <MockText>Voltar</MockText>
      </MockTouchableOpacity>
    </MockView>
  ),
}));

describe('ForgotMyPasswordScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockUpdateEmail = jest.fn();
  const mockHandleBackPress = jest.fn();
  const mockHandleVerificarEmail = jest.fn();

  const mockViewModelBase = {
    email: '',
    updateEmail: mockUpdateEmail,
    errors: {},
    handleBackPress: mockHandleBackPress,
    handleVerificarEmail: mockHandleVerificarEmail,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useForgotMyPasswordViewModel as jest.Mock).mockReturnValue(
      mockViewModelBase
    );
  });

  it('deve renderizar os elementos da tela corretamente', () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotMyPasswordScreen navigation={mockNavigation} />
    );

    expect(getByText('Esqueci minha senha')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByText('Enviar')).toBeTruthy();
  });

  it('deve chamar updateEmail quando o texto do input mudar', () => {
    const { getByPlaceholderText } = render(
      <ForgotMyPasswordScreen navigation={mockNavigation} />
    );

    const input = getByPlaceholderText('Email');

    fireEvent.changeText(input, 'teste@email.com');

    expect(mockUpdateEmail).toHaveBeenCalledWith(
      'teste@email.com'
    );
  });

  it('deve exibir a mensagem de erro quando houver erro de validação do e-mail', () => {
    (useForgotMyPasswordViewModel as jest.Mock).mockReturnValue({
      ...mockViewModelBase,
      errors: { email: 'E-mail inválido ou obrigatório' },
    });

    const { getByText } = render(
      <ForgotMyPasswordScreen navigation={mockNavigation} />
    );

    expect(
      getByText('E-mail inválido ou obrigatório')
    ).toBeTruthy();
  });

  it('deve disparar handleVerificarEmail ao clicar no botão Enviar', () => {
    const { getByText } = render(
      <ForgotMyPasswordScreen navigation={mockNavigation} />
    );

    const button = getByText('Enviar');

    fireEvent.press(button);

    expect(
      mockHandleVerificarEmail
    ).toHaveBeenCalledTimes(1);
  });

  it('deve disparar handleBackPress ao clicar no botão de voltar do header', () => {
    const { getByTestId } = render(
      <ForgotMyPasswordScreen navigation={mockNavigation} />
    );

    const backButton = getByTestId('back-button');

    fireEvent.press(backButton);

    expect(mockHandleBackPress).toHaveBeenCalledTimes(1);
  });
});