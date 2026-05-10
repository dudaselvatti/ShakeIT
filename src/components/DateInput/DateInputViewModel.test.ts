import { renderHook, act } from '@testing-library/react-native';
import { useDateInputViewModel, Props } from './DateInputViewModel';
import { Platform } from 'react-native';
import { theme } from "../../styles/theme";

jest.mock('../../utils/Formatting/formatDate', () => ({
  formatDate: jest.fn((date) => (date ? "10/05/2026" : "")),
}));

describe('useDateInputViewModel', () => {
  const mockOnChangeDate = jest.fn();
  const defaultProps: Props = {
    label: 'Data de Nascimento',
    onChangeDate: mockOnChangeDate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o placeholder quando nenhum valor for fornecido', () => {
    const customPlaceholder = "Selecione a data";
    const { result } = renderHook(() => 
      useDateInputViewModel({ ...defaultProps, placeholder: customPlaceholder })
    );

    expect(result.current.dateText).toBe(customPlaceholder);
    expect(result.current.touchableOpacityTextStyles).toContainEqual({
      color: theme.colors.textLight
    });
  });

  it('deve retornar a data formatada quando um valor for fornecido', () => {
    const mockDate = new Date(2026, 4, 10);
    const { result } = renderHook(() => 
      useDateInputViewModel({ ...defaultProps, value: mockDate })
    );

    expect(result.current.dateText).toBe("10/05/2026");
    expect(result.current.touchableOpacityTextStyles).toContainEqual({
      color: theme.colors.text
    });
  });

  it('deve gerenciar a visibilidade do picker (abrir e fechar)', () => {
    const { result } = renderHook(() => useDateInputViewModel(defaultProps));

    expect(result.current.showPicker).toBe(false);

    act(() => {
      result.current.openPicker();
    });
    expect(result.current.showPicker).toBe(true);

    act(() => {
      result.current.closePicker();
    });
    expect(result.current.showPicker).toBe(false);
  });

  describe('handleChange', () => {
    it('deve chamar onChangeDate e fechar o picker quando o tipo for "set" no Android', () => {
      Platform.OS = 'android';
      const { result } = renderHook(() => useDateInputViewModel(defaultProps));
      const selectedDate = new Date();

      act(() => {
        result.current.handleChange({ type: 'set' }, selectedDate);
      });

      expect(mockOnChangeDate).toHaveBeenCalledWith(selectedDate);
      expect(result.current.showPicker).toBe(false);
    });

    it('deve manter o picker aberto no iOS (comportamento padrão do sistema)', () => {
      Platform.OS = 'ios';
      const { result } = renderHook(() => useDateInputViewModel(defaultProps));

      act(() => {
        result.current.handleChange({ type: 'set' }, new Date());
      });

      expect(result.current.showPicker).toBe(true);
    });

    it('deve fechar o picker sem chamar onChangeDate se o usuário cancelar (dismissedAction)', () => {
      const { result } = renderHook(() => useDateInputViewModel(defaultProps));

      act(() => {
        result.current.openPicker();
        result.current.handleChange({ type: 'dismissed' });
      });

      expect(mockOnChangeDate).not.toHaveBeenCalled();
      expect(result.current.showPicker).toBe(false);
    });
  });
});