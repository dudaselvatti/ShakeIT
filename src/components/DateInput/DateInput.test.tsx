import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DateInput } from './index';

// Simulamos o componente nativo para não dar erro no ambiente de testes
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return (props: any) => <View testID="mock-date-picker" {...props} />;
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
    expect(getByText('DD/MM/AAAA')).toBeTruthy(); // Placeholder padrão
  });

  it('deve mostrar o calendário (picker) quando o utilizador clica', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <DateInput 
        label="Data" 
        value={undefined} 
        onChangeDate={jest.fn()} 
      />
    );

    // Antes de clicar, o calendário não deve estar no ecrã
    expect(queryByTestId('mock-date-picker')).toBeNull();

    // Clica no botão (que tem o texto do placeholder)
    fireEvent.press(getByText('DD/MM/AAAA'));

    // Após o clique, o calendário simulado deve aparecer
    expect(getByTestId('mock-date-picker')).toBeTruthy();
  });

  it('deve exibir a data formatada se um valor for passado', () => {
    // Criamos uma data fixa para o teste (Nota: o mês começa em 0 no JavaScript, por isso 11 = Dezembro)
    const dataMock = new Date(2026, 11, 25); 
    
    const { getByText } = render(
      <DateInput 
        label="Data" 
        value={dataMock} 
        onChangeDate={jest.fn()} 
      />
    );

    // Verifica se a data foi formatada para o padrão DD/MM/AAAA
    expect(getByText('25/12/2026')).toBeTruthy();
  });
});