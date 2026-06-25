import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createStyles } from './styles';
import { useAppHeaderViewModel, Props } from './AppHeaderViewModel';
import { IconButton } from '../IconButton';
import { useAppTheme } from "../../contexts/ThemeContext";
import { useNotification } from '../../contexts/NotificationContext/NotificationContext';

export const AppHeader = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { 
        title, 
        showBackButton, 
        showSettingsIcon, 
        showNotificationsIcon,
        handleBackPress, 
        handleSettingsPress,
        handleNotificationsPress
    } = useAppHeaderViewModel(props);
    
    const { unreadCount } = useNotification();
    
    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {showBackButton && (
                    <IconButton iconName="chevron-left" onPress={handleBackPress} />
                )}
            </View>

            <Text style={styles.headerTitle}>{title}</Text>

            <View style={[styles.rightContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                {showNotificationsIcon && (
                    <TouchableOpacity testID="icon-button-notifications" onPress={handleNotificationsPress} style={{ padding: 4, marginRight: 8, position: 'relative' }}>
                        <Image 
                            source={require('../../../assets/sino.png')} 
                            style={{ width: 24, height: 24 }}
                            resizeMode="contain" 
                        />
                        {unreadCount > 0 && (
                            <View style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                backgroundColor: 'red',
                                borderRadius: 10,
                                width: 14,
                                height: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
                {showSettingsIcon && (
                    <TouchableOpacity testID="icon-button-settings" onPress={handleSettingsPress} style={{ padding: 4 }}>
                        <Image 
                            source={require('../../../assets/config.png')} 
                            style={{ width: 24, height: 24 }}
                            resizeMode="contain" 
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}