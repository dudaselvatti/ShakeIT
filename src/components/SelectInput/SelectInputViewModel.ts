import { ViewStyle } from 'react-native';

type SelectOption = {
    key: string;
    label: string;
    value: string;
};

export interface Props {
    label: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    style?: any;
    containerStyle?: ViewStyle;
    testID?: string;
}

export function useSelectInputViewModel({ label, selectedValue, onValueChange, options, style, containerStyle, testID }: Props) {
    const selectedOption = options.find(option => option.value === selectedValue);
    
    const displayValue = selectedOption ? selectedOption.label : "Selecione...";
    const isPlaceholder = !selectedValue;

    return {
        label,
        selectedValue,
        onValueChange,
        options,
        style,
        containerStyle,
        displayValue,
        isPlaceholder,
        testID
    };
}
