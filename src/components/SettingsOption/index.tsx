import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { styles } from './styles';
import { useSettingsOptionViewModel, Props } from './SettingsOptionViewModel';

export const SettingsOption = (props: Props) => {
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