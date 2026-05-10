import { TextInputProps, ViewStyle } from "react-native";
import { styles } from "./styles";

export interface Props extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle;
}

export function useInputViewModel({ label, containerStyle, style, ...textInputProps }: Props) {
    const textInputStyle = [styles.input, style];

    return {
        label,
        containerStyle,
        textInputStyle,
        ...textInputProps,
    };
}