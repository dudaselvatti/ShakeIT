import { ViewStyle } from 'react-native';

export interface Props {
    label: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    options: string[];
    style?: any;
    containerStyle?: ViewStyle;
    testID?: string;
}

export function useSelectInputViewModel({ label, selectedValue, onValueChange, options, style, containerStyle, testID }: Props) {
    return {
        label,
        selectedValue,
        onValueChange,
        options,
        style,
        containerStyle,
        testID
    };
}