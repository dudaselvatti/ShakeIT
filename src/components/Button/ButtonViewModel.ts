import { TouchableOpacityProps } from "react-native";
import { theme } from "../../styles/theme";
import { styles } from "./styles";

export interface Props extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "accent" | "outline" | "text";
    isLoading?: boolean;
}
export function useButtonViewModel({ title, variant = "primary", isLoading = false, style, disabled = false, ...touchableOpacityProps }: Props) {
    const isDisabled = isLoading || disabled;

    const loadingColor =
        variant === "outline" || variant === "text"
            ? theme.colors.primary
            : "#FFF";

    const touchableOpacityStyles = [
        styles.base,
        styles[variant],
        style,
    ];

    const textStyles = [
        styles.textBase, 
        styles[`${variant}Text`]
    ];

    return {
        title,
        isLoading,
        isDisabled,
        loadingColor,
        touchableOpacityStyles,
        textStyles,
        touchableOpacityProps,
    };
}