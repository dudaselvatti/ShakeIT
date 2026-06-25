import { collection, doc, setDoc, query, where, orderBy, onSnapshot, getDocs, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { AppNotification } from "../../../types/AppNotification";

const NOTIFICATIONS_COLLECTION = "notifications";

export async function createNotification(notificationData: Omit<AppNotification, 'id' | 'created_at' | 'read'>): Promise<string> {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const notification: AppNotification = {
        ...notificationData,
        id,
        read: false,
        created_at: new Date().toISOString(),
    };
    
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, id), notification);
    return id;
}

export function listenToUserNotifications(userId: string, callback: (notifications: AppNotification[]) => void) {
    const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("user_id", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
        const notifications: AppNotification[] = [];
        snapshot.forEach((doc) => {
            notifications.push(doc.data() as AppNotification);
        });
        notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        callback(notifications);
    });
}

export async function markNotificationAsRead(id: string): Promise<void> {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, id);
    await updateDoc(docRef, { read: true });
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
    const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("user_id", "==", userId),
        where("read", "==", false)
    );
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    snapshot.forEach((document) => {
        batch.update(doc(db, NOTIFICATIONS_COLLECTION, document.id), { read: true });
    });
    
    await batch.commit();
}

export async function deleteAllNotificationsForUser(userId: string): Promise<void> {
    const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("user_id", "==", userId)
    );
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    snapshot.forEach((document) => {
        batch.delete(doc(db, NOTIFICATIONS_COLLECTION, document.id));
    });
    
    await batch.commit();
}
