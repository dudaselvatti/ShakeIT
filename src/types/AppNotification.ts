export type AppNotification = {
    id: string;
    user_id: string; // The user receiving the notification
    title: string;
    message: string;
    type: 'party_join' | 'raffle_complete' | 'general';
    read: boolean;
    related_party_id?: string;
    created_at: string;
};
