import { useState } from "react";
import { ViewStyle, Platform } from "react-native";
import { createStyles } from "./styles";
import { theme } from "../../styles/theme";
import { formatDate } from "../../utils/Formatting/formatDate";
import { useAppTheme } from "../../contexts/ThemeContext";

export interface Props {
    label: string;
    display?: "default" | "compact" | "inline" | "spinner" | "clock" | "calendar" | undefined;
    value?: Date;
    onChangeDate: (date: Date) => void;
    placeholder?: string;
    containerStyle?: ViewStyle;
    minimumDate?: Date;
    maximumDate?: Date;
    testID?: string;
}

export function useDateInputViewModel({ label, display = "default", value, onChangeDate, placeholder = "DD/MM/AAAA", containerStyle, minimumDate, maximumDate, testID}: Props) {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const [showPicker, setShowPicker] = useState(false);

    const formattedDate = formatDate(value);

    const touchableOpacityTextStyles = [
        styles.inputText, 
        { color: value ? theme.colors.text : theme.colors.textLight }
    ];

    const dateText = value ? formattedDate : placeholder;

    const openPicker = () => {
        setShowPicker(true);
    };

    const closePicker = () => {
        setShowPicker(false);
    };

    const handleChange = (event: any, selectedDate?: Date) => {
        if (event.type === "set" && selectedDate) {
            onChangeDate(selectedDate);
            if (Platform.OS === "android") {
                closePicker();
            } else {
                openPicker();
            }
        } else {
            closePicker();
        }
    };

    return {
        label,
        display,
        value,
        dateText,
        containerStyle,
        minimumDate,
        maximumDate,
        touchableOpacityTextStyles,
        showPicker,
        openPicker,
        closePicker,
        handleChange,
        testID,
    };
};