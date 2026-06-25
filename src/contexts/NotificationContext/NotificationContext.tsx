import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from '../../types/AppNotification';
import { listenToUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteAllNotificationsForUser } from '../../services/cloud/Notification/NotificationDb';
import { useAuth } from '../AuthContext/AuthContext';
import Toast from 'react-native-toast-message';
import { navigate } from '../../utils/RootNavigation';
import { useRef } from 'react';

interface NotificationContextData {
    notifications: AppNotification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { usuarioAtual } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const previousNotificationsRef = useRef<string[]>([]);

    useEffect(() => {
        if (!usuarioAtual?.id) {
            setNotifications([]);
            previousNotificationsRef.current = [];
            return;
        }

        const unsubscribe = listenToUserNotifications(usuarioAtual.id, (newNotifications) => {
            const previousIds = previousNotificationsRef.current;
            const newIds = newNotifications.map(n => n.id);

            // Se já tínhamos carregado e chegou um id novo não lido
            if (previousIds.length > 0) {
                const justAdded = newNotifications.filter(n => !previousIds.includes(n.id) && !n.read);
                justAdded.forEach(n => {
                    Toast.show({
                        type: 'app_notification',
                        text1: n.title,
                        text2: n.message,
                        position: 'top',
                        visibilityTime: 5000,
                        onPress: () => {
                            if (n.related_party_id) {
                                navigate("Home", { openPartyId: n.related_party_id, notificationType: n.type }); 
                            }
                            markNotificationAsRead(n.id);
                        }
                    });
                });
            }
            
            previousNotificationsRef.current = newIds;
            setNotifications(newNotifications);
        });

        return () => unsubscribe();
    }, [usuarioAtual?.id]);

    const markAsRead = async (id: string) => {
        await markNotificationAsRead(id);
    };

    const markAllAsReadAction = async () => {
        if (usuarioAtual?.id) {
            await markAllNotificationsAsRead(usuarioAtual.id);
        }
    };

    const clearAllAction = async () => {
        if (usuarioAtual?.id) {
            await deleteAllNotificationsForUser(usuarioAtual.id);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead: markAllAsReadAction, clearAll: clearAllAction }}>
            {children}
        </NotificationContext.Provider>
    );
};

export function useNotification() {
    return useContext(NotificationContext);
}
