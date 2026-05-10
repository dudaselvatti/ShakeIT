import { renderHook, act } from '@testing-library/react-native';
import { useCurrencyInputViewModel, Props } from './CurrencyInputViewModel';
import { formatCurrency } from "../../utils/Formatting/formatCurrency";

jest.mock("../../utils/Formatting/formatCurrency", () => ({
  formatCurrency: jest.fn((text: string) => `R$ ${text}`),
}));

describe('useCurrencyInputViewModel', () => {
  const mockOnChangeText = jest.fn();
  const defaultProps: Props = {
    label: 'Preço',
    onChangeText: mockOnChangeText,
    value: '10',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar as props básicas corretamente', () => {
    const { result } = renderHook(() => useCurrencyInputViewModel(defaultProps));

    expect(result.current.label).toBe('Preço');
    expect(result.current.value).toBe('10');
  });

  it('deve chamar onChangeText com o valor formatado quando o texto mudar', () => {
    const { result } = renderHook(() => useCurrencyInputViewModel(defaultProps));
    const inputUnformatted = '20';
    const expectedFormatted = 'R$ 20';

    act(() => {
      result.current.handleTextChange(inputUnformatted);
    });

    expect(formatCurrency).toHaveBeenCalledWith(inputUnformatted);
    
    expect(mockOnChangeText).toHaveBeenCalledWith(expectedFormatted);
  });

  it('não deve quebrar se onChangeText não for fornecido', () => {
    const { result } = renderHook(() => 
      useCurrencyInputViewModel({ label: 'Sem Callback' })
    );

    expect(() => {
      act(() => {
        result.current.handleTextChange('any-value');
      });
    }).not.toThrow();
  });

  it('deve manter a referência da função handleTextChange estável', () => {
    const { result, rerender } = renderHook(
      (props: Props) => useCurrencyInputViewModel(props),
      { initialProps: defaultProps }
    );

    const firstReference = result.current.handleTextChange;

    rerender({ ...defaultProps, value: '50' });

    expect(result.current.handleTextChange).toBe(firstReference);
});

  it('deve repassar o restante das props do TextInput', () => {
    const { result } = renderHook(() => 
      useCurrencyInputViewModel({ 
        ...defaultProps, 
        placeholder: 'Digite o valor',
        keyboardType: 'numeric' 
      })
    );

    expect(result.current.placeholder).toBe('Digite o valor');
    expect(result.current.keyboardType).toBe('numeric');
  });
});