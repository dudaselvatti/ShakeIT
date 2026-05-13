import { useCallback } from "react";
import { TextInputProps, ViewStyle } from "react-native";
import { formatCurrency } from "../../utils/Formatting/formatCurrency";


export interface Props extends Omit<TextInputProps, 'onChangeText'> {
    label: string;
    containerStyle?: ViewStyle;
    onChangeText?: (text: string) => void;
}

export function useCurrencyInputViewModel({ label, containerStyle, onChangeText, value, ...textInputProps }: Props) {
    const handleTextChange = useCallback((text: string) => {
        if (!onChangeText) return;

        const formattedValue = formatCurrency(text);

        onChangeText(formattedValue);
    }, [onChangeText]);

    return {
        handleTextChange,
        label,
        containerStyle,
        onChangeText,
        value,
        ...textInputProps
    };
}