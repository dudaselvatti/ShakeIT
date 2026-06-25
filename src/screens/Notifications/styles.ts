import { StyleSheet } from 'react-native';
import { ThemeType as Theme } from '../../styles/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    listContent: {
        padding: 24,
        paddingBottom: 40,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: theme.metrics.borderRadius,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center'
    },
    unreadCard: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10', // 10% opacity
    },
    iconContainer: {
        marginRight: 16,
    },
    icon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: theme.colors.textLight,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.textLight,
        marginTop: 40,
        fontSize: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    }
});
