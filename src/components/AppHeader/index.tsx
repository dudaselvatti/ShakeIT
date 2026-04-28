import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

interface Props {
    headerTitle: string;
}

export const AppHeader = ({ headerTitle }: Props) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.returnArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
    );
}