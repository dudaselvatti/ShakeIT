import { TouchableOpacityProps, TextStyle, StyleProp } from "react-native";
import { theme } from "../../styles/theme";
import { createStyles } from "./styles";
import { useAppTheme } from "../../contexts/ThemeContext";

export interface Props extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "accent" | "outline" | "text" | "danger" |"redNoOutline";
    isLoading?: boolean;
    textStyles?: StyleProp<TextStyle>;
}
export function useButtonViewModel({ title, variant = "primary", isLoading = false, style, disabled = false, textStyles: propsTextStyles, ...touchableOpacityProps }: Props) {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
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
        styles[`${variant}Text`],
        propsTextStyles,
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