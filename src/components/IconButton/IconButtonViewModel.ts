import { TouchableOpacityProps } from "react-native";
import { Feather } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { styles } from "./styles";

export interface Props extends TouchableOpacityProps {
  iconName: keyof typeof Feather.glyphMap;
  variant?: "fab" | "transparent";
  color?: string;
  size?: number;
}

export function useIconButtonViewModel({ iconName, variant = "transparent", color, size, style, ...touchableOpacityProps }: Props) {
    const defaultColor = variant === "fab" ? theme.colors.surface : theme.colors.text;

    const defaultSize = variant === "fab" ? 32 : 24;

    const iconColor = color || defaultColor;

    const iconSize = size || defaultSize;

    const touchableOpacityStyles = [styles.base, styles[variant], style];

    return {
        iconName,
        iconColor,
        iconSize,
        touchableOpacityStyles,
        ...touchableOpacityProps
    };
};