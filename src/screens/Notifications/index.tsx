import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../contexts/ThemeContext';
import { AppHeader } from '../../components/AppHeader';
import { useNotificationsViewModel } from './NotificationsViewModel';
import { Button } from '../../components/Button';
import { createStyles } from './styles';

export const NotificationsScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { notifications, handleNotificationPress, handleMarkAllAsRead } = useNotificationsViewModel();

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle="Notificações" showSettingsIcon={false} />
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    notifications.length > 0 ? (
                        <View style={styles.headerContainer}>
                            <Text style={{ color: theme.colors.textLight }}>
                                {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                            </Text>
                            {unreadCount > 0 && (
                                <Button 
                                    title="Marcar todas como lidas" 
                                    onPress={handleMarkAllAsRead} 
                                    variant="text" 
                                />
                            )}
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Você não tem notificações.</Text>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.notificationCard, !item.read && styles.unreadCard]}
                        onPress={() => handleNotificationPress(item)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconContainer}>
                            <Image source={require('../../../assets/sino.png')} style={styles.icon} />
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.message}>{item.message}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};
