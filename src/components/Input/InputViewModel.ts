import { useState } from "react";
import { TextInputProps, ViewStyle } from "react-native";
import { styles } from "./styles";

export interface Props extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  isPassword?: boolean;
}

export function useInputViewModel({ label, containerStyle, inputContainerStyle, style, isPassword, secureTextEntry, ...textInputProps }: Props) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const textInputStyle = [styles.input, style];
    
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const mergedInputContainerStyle = [
        styles.inputContainer,
        textInputProps.multiline && { alignItems: 'flex-start' as const },
        inputContainerStyle
    ];

    return {
        label,
        containerStyle,
        mergedInputContainerStyle,
        textInputStyle,
        isPassword,
        secureTextEntry: isPassword ? !isPasswordVisible : secureTextEntry,
        isPasswordVisible,
        togglePasswordVisibility,
        ...textInputProps,
    };
}