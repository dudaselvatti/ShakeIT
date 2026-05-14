import React from 'react';
import { View, ViewStyle } from 'react-native';
import { styles } from './styles';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
}

export const Card = ({ children, style }: CardProps) => {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
};
