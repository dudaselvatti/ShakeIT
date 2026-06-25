import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '../../contexts/ThemeContext';
import { PixelIcon as Feather } from '../PixelIcon';
import { createStyles } from './styles';
import { useAppNotificationToastViewModel, Props } from './AppNotificationToastViewModel';

export const AppNotificationToast = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { title, message, handlePress, handleClose } = useAppNotificationToastViewModel(props);

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={handlePress}>
            <View style={styles.iconContainer}>
                <Image source={require('../../../assets/sino.png')} style={styles.icon} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message} numberOfLines={2}>{message}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Feather name="x" size={20} color={theme.colors.textLight} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};
