import { StyleSheet } from 'react-native';
import { ThemeType as Theme } from '../../styles/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        width: '90%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.metrics.borderRadius,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    iconContainer: {
        marginRight: 12,
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
    closeButton: {
        padding: 4,
    }
});
