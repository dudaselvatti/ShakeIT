import React from 'react';
import { View, ViewStyle } from 'react-native';
import { styles } from './styles';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    testID?: string;
}

export const Card = ({ children, style, testID }: CardProps) => {
    return (
        <View style={[styles.container, style]} testID={testID}>
            {children}
        </View>
    );
};
