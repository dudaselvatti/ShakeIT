import { ViewStyle } from 'react-native';

export interface Props {
    label: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    options: string[];
    style?: any;
    containerStyle?: ViewStyle;
}

export function useSelectInputViewModel({ label, selectedValue, onValueChange, options, style, containerStyle }: Props) {
    return {
        label,
        selectedValue,
        onValueChange,
        options,
        style,
        containerStyle
    };
}