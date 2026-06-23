import { StyleSheet } from "react-native";
import { ThemeType } from "../../styles/theme";

export const createStyles = (theme: ThemeType) => StyleSheet.create({
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
    participantsCount: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 10,
        marginBottom: 10,
    },
    flatListContainer: {
        flex: 1,
    },
    footer: {
        padding: theme.metrics.padding,
    },
    btnSorteio: {
        marginTop: 12,
    },
});