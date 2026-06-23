import React from 'react';
import { View, ViewStyle } from 'react-native';
import { createStyles } from './styles';
import { useAppTheme } from "../../contexts/ThemeContext";

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    testID?: string;
}

export const Card = ({ children, style, testID }: CardProps) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    return (
        <View style={[styles.container, style]} testID={testID}>
            {children}
        </View>
    );
};
