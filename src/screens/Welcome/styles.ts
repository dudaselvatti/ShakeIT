import { StyleSheet } from 'react-native';
import { ThemeType } from '../../styles/theme';

export const createStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: theme.colors.textLight,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 48,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 48,
        width: '100%',
    },
    loginButton: {
        marginTop: 16,
    },
});
