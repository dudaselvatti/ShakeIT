import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.metrics.padding,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    nome: {
        fontSize: 15,
        color: theme.colors.text,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 13,
        color: theme.colors.textLight,
        opacity: 0.6,
        marginLeft: 5,
    },
});
