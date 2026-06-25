import { ReactNode } from "react";
import { TouchableOpacityProps } from "react-native";
import { PixelIcon as Feather } from "../PixelIcon";

export interface Props extends TouchableOpacityProps {
    title: string;
    children?: ReactNode;
    rightElement?: ReactNode;
}

export function useSettingsOptionViewModel({ title, rightElement, children, ...touchableOpacityProps }: Props) {
    return {
        title,
        rightElement,
        children,
        ...touchableOpacityProps
    };
}