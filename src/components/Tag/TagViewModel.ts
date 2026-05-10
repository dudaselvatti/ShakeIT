import { theme } from "../../styles/theme";

export interface Props {
    label: string;
    onRemove?: () => void;
    color?: string;
}

export function useTagViewModel({label, onRemove, color}: Props) {
    const backgroundColor = color ? color + "20" : theme.colors.primary + "20";
    const textColor = color || theme.colors.primary;

    return {
        label,
        onRemove,
        backgroundColor,
        textColor
    };
}