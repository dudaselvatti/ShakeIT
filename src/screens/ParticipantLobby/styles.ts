import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentBody: {
        flex: 1,
        padding: theme.metrics.padding,
    },
    statusHighlight: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary + '10',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: theme.metrics.borderRadius,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.primary + '30',
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
    },
    participantesCount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 12,
    },
    flatListContainer: {
        flex: 1,
    },
});
