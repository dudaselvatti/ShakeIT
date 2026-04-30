import React from 'react';
import { View } from 'react-native';
import { IconButton } from '../IconButton';
import { useReturnHomeArrowViewModel } from './ReturnHomeArrowViewModel';
import { styles } from './styles';

export const ReturnHomeArrow = () => {
    const { handlePress } = useReturnHomeArrowViewModel();
    return (
        <View style={styles.returnArrowContainer}>
            <IconButton iconName="chevron-left" onPress={handlePress} />
        </View>
    );
};