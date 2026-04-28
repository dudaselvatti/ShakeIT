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
    eventInfo: {
        alignItems: 'center',
        marginBottom: 10,
    },
    partyName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 5,
    },
    codeLabel: {
        fontSize: 14,
        color: '#666',
    },
    codeValue: {
        fontWeight: 'bold',
        color: '#1D3557',
    },
    participantesCount: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 10,
        marginBottom: 10,
    },
    flatListContainer: {
        height: 300, //A scroll bar do FlatList não queria funcionar sem uma height definida
    },
    footer: {
        padding: theme.metrics.padding,
    },
    btnSorteio: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnSorteioText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        textTransform: 'uppercase',
    },
});