import { ReactNode } from "react";
import { TouchableOpacityProps } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface Props extends TouchableOpacityProps {
    title: string;
    children?: ReactNode;
    iconName?: keyof typeof Feather.glyphMap;
    iconSize?: number;
    iconColor?: string;
}

export function useSettingsOptionViewModel({ title, iconName = "chevron-right", iconSize, iconColor, children, ...touchableOpacityProps }: Props) {
    return {
        title,
        iconName,
        iconSize,
        iconColor,
        children,
        ...touchableOpacityProps
    };
}