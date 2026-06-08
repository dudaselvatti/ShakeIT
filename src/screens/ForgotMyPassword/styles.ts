import { StyleSheet, Platform, StatusBar } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    content: {
        //flex: 1, //Comentado por enquanto, para deixar o botão perto do input
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: theme.colors.primary,
        marginBottom: 24,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonsView: {
        padding: 24,
        backgroundColor: theme.colors.background,
    },
    registrationButton: {
        padding: 24,
        backgroundColor: theme.colors.background,
        color: theme.colors.primary,
    },
    forgotMyPasswordButton: {
        padding: 24,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: 14,
        marginTop: -16,
        marginBottom: 16,
        marginLeft: 4,
    },
    successText: {
        color: theme.colors.success,
        fontSize: 14,
        marginTop: -16,
        marginBottom: 16,
        marginLeft: 4,
    }
});