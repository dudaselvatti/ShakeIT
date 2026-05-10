import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { ReturnHomeArrow } from '../ReturnHomeArrow';
import { useAppHeaderViewModel, Props } from './AppHeaderViewModel';

export const AppHeader = (props: Props) => {
    const { title } = useAppHeaderViewModel(props);
    
    return (
        <View style={styles.header}>
            <ReturnHomeArrow />
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
}