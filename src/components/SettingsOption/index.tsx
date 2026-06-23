import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { createStyles } from './styles';
import { useSettingsOptionViewModel, Props } from './SettingsOptionViewModel';
import { useAppTheme } from "../../contexts/ThemeContext";

export const SettingsOption = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { title, iconName, iconSize, iconColor, children, ...touchableOpacityProps } = useSettingsOptionViewModel(props)

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
            accessibilityRole="button"
            {...touchableOpacityProps}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Feather
                    name={iconName}
                    size={iconSize}
                    color={iconColor}
                />
            </View>
            <View style={styles.children}>
                {children}
            </View>
        </TouchableOpacity>
    );
};