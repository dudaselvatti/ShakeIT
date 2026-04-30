import React from 'react';
import { TouchableOpacity as MockTouchableOpacity} from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ReturnHomeArrow } from './index';
import { useReturnHomeArrowViewModel } from './ReturnHomeArrowViewModel';

jest.mock('./ReturnHomeArrowViewModel');

jest.mock('../IconButton', () => {
  return {
    IconButton: ({ onPress, iconName }: any) => (
      <MockTouchableOpacity 
        testID={`mock-icon-button-${iconName}`}
        onPress={onPress} 
      />
    ),
  };
});

describe('ReturnHomeArrow Component', () => {
  const mockHandlePress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useReturnHomeArrowViewModel as jest.Mock).mockReturnValue({
      handlePress: mockHandlePress,
    });
  });

  it('deve renderizar corretamente com o ícone de chevron-left', () => {
    const { getByTestId } = render(<ReturnHomeArrow />);
    expect(getByTestId('mock-icon-button-chevron-left')).toBeTruthy();
  });

  it('deve chamar handlePress do ViewModel quando o botão for pressionado', () => {
    const { getByTestId } = render(<ReturnHomeArrow />);
    const iconButton = getByTestId('mock-icon-button-chevron-left');
    
    fireEvent.press(iconButton);
    expect(mockHandlePress).toHaveBeenCalledTimes(1);
  });
});