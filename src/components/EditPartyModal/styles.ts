import { StyleSheet } from "react-native";
import { ThemeType } from "../../styles/theme";

export const createStyles = (theme: ThemeType) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.metrics.borderRadius * 2,
        borderTopRightRadius: theme.metrics.borderRadius * 2,
        padding: theme.metrics.padding,
        maxHeight: "90%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 24,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: 12,
        marginTop: -12,
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
    },
    button: {
        flex: 1,
    },
});
