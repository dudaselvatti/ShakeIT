import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    footer: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: 12,
        fontWeight: "600",
        marginTop: -8,
        marginBottom: 12,
        marginLeft: 4,
    },
    errorBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDE8E8",
        borderColor: "#F8B4B4",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    errorBannerText: {
        flex: 1,
        color: theme.colors.danger,
        fontSize: 14,
        fontWeight: "500",
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 8,
        marginTop: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    halfColumn: {
        flex: 1,
    },
});
