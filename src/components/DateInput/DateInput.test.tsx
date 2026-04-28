import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DateInput } from './index';

jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = jest.requireActual('react-native');
  const MockDateTimePicker = (props: any) => <View testID="mock-date-picker" {...props} />;
  MockDateTimePicker.displayName = 'MockDateTimePicker';
  return MockDateTimePicker;
});

describe('Componente DateInput', () => {
  it('deve renderizar a label e o placeholder inicial corretamente', () => {
    const { getByText } = render(
      <DateInput 
        label="Data da Revelação" 
        value={undefined} 
        onChangeDate={jest.fn()} 
      />
    );
    
    expect(getByText('Data da Revelação')).toBeTruthy();
    expect(getByText('DD/MM/AAAA')).toBeTruthy();
  });

  it('deve mostrar o calendário (picker) quando o utilizador clica', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <DateInput 
        label="Data" 
        value={undefined} 
        onChangeDate={jest.fn()} 
      />
    );

    expect(queryByTestId('mock-date-picker')).toBeNull();

    fireEvent.press(getByText('DD/MM/AAAA'));

    expect(getByTestId('mock-date-picker')).toBeTruthy();
  });

  it('deve exibir a data formatada se um valor for passado', () => {
    const dataMock = new Date(2026, 11, 25); 
    
    const { getByText } = render(
      <DateInput 
        label="Data" 
        value={dataMock} 
        onChangeDate={jest.fn()} 
      />
    );

    expect(getByText('25/12/2026')).toBeTruthy();
  });
});