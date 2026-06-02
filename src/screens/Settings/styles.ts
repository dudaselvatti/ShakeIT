import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.metrics.padding,
    },
    heading: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 8,
        textTransform: "uppercase",
    },
    optionsList: {
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.metrics.borderRadius,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 16,
    },
    option: {
        fontSize: 16,
        color: theme.colors.text,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    footer: {
        padding: 24,
        backgroundColor: theme.colors.background,
    },
});
