import { useTagViewModel, Props } from './TagViewModel';
import { theme } from '../../styles/theme';

jest.mock('../../styles/theme', () => ({
  theme: {
    colors: {
      primary: '#007AFF',
    },
  },
}));

describe('useTagViewModel', () => {
  const mockOnRemove = jest.fn();

  it('deve retornar as cores baseadas no tema quando nenhuma cor for fornecida', () => {
    const props: Props = {
      label: 'React Native',
      onRemove: mockOnRemove,
    };

    const result = useTagViewModel(props);

    expect(result.textColor).toBe(theme.colors.primary);
    expect(result.backgroundColor).toBe(`${theme.colors.primary}20`);
    expect(result.label).toBe('React Native');
  });

  it('deve retornar as cores customizadas quando a prop color for fornecida', () => {
    const customColor = '#FF5733';
    const props: Props = {
      label: 'Custom Tag',
      color: customColor,
    };

    const result = useTagViewModel(props);

    expect(result.textColor).toBe(customColor);
    expect(result.backgroundColor).toBe(`${customColor}20`);
  });

  it('deve retornar undefined para onRemove se não for fornecido', () => {
    const props: Props = { label: 'No Remove' };
    const result = useTagViewModel(props);

    expect(result.onRemove).toBeUndefined();
  });

  it('deve manter a referência da função onRemove quando fornecida', () => {
    const props: Props = {
      label: 'With Remove',
      onRemove: mockOnRemove,
    };

    const result = useTagViewModel(props);
    
    if (result.onRemove) {
      result.onRemove();
    }

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });
});