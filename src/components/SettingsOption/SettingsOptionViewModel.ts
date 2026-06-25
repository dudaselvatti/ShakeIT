import { ReactNode } from "react";
import { TouchableOpacityProps } from "react-native";
import { PixelIcon as Feather } from "../PixelIcon";

export interface Props extends TouchableOpacityProps {
    title: string;
    children?: ReactNode;
    iconName?: string;
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