import { useState } from "react";
import { ViewStyle, Platform } from "react-native";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { formatDate } from "../../utils/Formatting/formatDate";

export interface Props {
    label: string;
    value?: Date;
    onChangeDate: (date: Date) => void;
    placeholder?: string;
    containerStyle?: ViewStyle;
}

export function useDateInputViewModel({ label, value, onChangeDate, placeholder = "DD/MM/AAAA", containerStyle }: Props) {
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
        value,
        dateText,
        containerStyle,
        touchableOpacityTextStyles,
        showPicker,
        openPicker,
        closePicker,
        handleChange,
    };
};