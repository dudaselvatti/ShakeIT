import { usePopupModalViewModel, Props } from './PopupModalViewModel';

describe('usePopupModalViewModel', () => {
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();

  const baseProps: Props = {
    visible: true,
    title: 'Título de Teste',
    message: 'Mensagem de teste para o modal',
    onCancel: mockOnCancel,
    onConfirm: mockOnConfirm,
    animationType: 'fade',
  };

  it('deve retornar todos os valores fornecidos corretamente', () => {
    const customProps: Props = {
      ...baseProps,
      cancelText: 'Sair',
      confirmText: 'Continuar',
    };

    const result = usePopupModalViewModel(customProps);

    expect(result.visible).toBe(true);
    expect(result.title).toBe('Título de Teste');
    expect(result.message).toBe('Mensagem de teste para o modal');
    expect(result.cancelText).toBe('Sair');
    expect(result.confirmText).toBe('Continuar');
    expect(result.animationType).toBe('fade');
  });

  it('deve aplicar os valores padrão para cancelText e confirmText', () => {
    const result = usePopupModalViewModel(baseProps);

    expect(result.cancelText).toBe('Cancelar');
    expect(result.confirmText).toBe('OK');
  });

  it('deve manter as referências das funções de callback', () => {
    const result = usePopupModalViewModel(baseProps);

    result.onCancel();
    result.onConfirm();

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('deve espalhar corretamente as propriedades adicionais (modalProps)', () => {
    const propsWithExtras: Props = {
      ...baseProps,
      transparent: true,
      statusBarTranslucent: true,
    };

    const result = usePopupModalViewModel(propsWithExtras);

    expect(result.transparent).toBe(true);
    expect(result.statusBarTranslucent).toBe(true);
  });
});