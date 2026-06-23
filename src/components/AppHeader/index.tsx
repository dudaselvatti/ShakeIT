import React from 'react';
import { View, Text } from 'react-native';
import { createStyles } from './styles';
import { useAppHeaderViewModel, Props } from './AppHeaderViewModel';
import { IconButton } from '../IconButton';
import { useAppTheme } from "../../contexts/ThemeContext";

export const AppHeader = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { 
        title, 
        showBackButton, 
        showSettingsIcon, 
        handleBackPress, 
        handleSettingsPress 
    } = useAppHeaderViewModel(props);
    
    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {showBackButton && (
                    <IconButton iconName="chevron-left" onPress={handleBackPress} />
                )}
            </View>

            <Text style={styles.headerTitle}>{title}</Text>

            <View style={styles.rightContainer}>
                {showSettingsIcon && (
                    <IconButton iconName="settings" onPress={handleSettingsPress} />
                )}
            </View>
        </View>
    );
}