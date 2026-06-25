import { useNavigation } from "@react-navigation/native";
import { useNotification } from "../../contexts/NotificationContext/NotificationContext";
import { AppNotification } from "../../types/AppNotification";

export function useNotificationsViewModel() {
    const navigation = useNavigation<any>();
    const { notifications, markAsRead, markAllAsRead, clearAll } = useNotification();

    const handleNotificationPress = async (notification: AppNotification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }
        if (notification.related_party_id) {
            navigation.navigate("Home", { openPartyId: notification.related_party_id, notificationType: notification.type }); 
        }
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const handleClearAll = async () => {
        await clearAll();
    };

    return {
        notifications,
        handleNotificationPress,
        handleMarkAllAsRead,
        handleClearAll
    };
}
