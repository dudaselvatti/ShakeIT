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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textLight,
        textAlign: "center",
        marginTop: 12,
        lineHeight: 22,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.metrics.borderRadius,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    dependentName: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.colors.text,
    },
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionButton: {
        marginLeft: 16,
    },
    cardContent: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 12,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    detailText: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginLeft: 8,
    },
    typeTag: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    typeTagChild: {
        backgroundColor: "#E2F0FD",
    },
    typeTagPet: {
        backgroundColor: "#FFEFC6",
    },
    typeTagOther: {
        backgroundColor: "#E2F8F5",
    },
    typeTagText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    typeTagTextChild: {
        color: "#1E88E5",
    },
    typeTagTextPet: {
        color: "#F5B041",
    },
    typeTagTextOther: {
        color: "#00897B",
    },
    footer: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
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
    successBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F8F5",
        borderColor: "#A3E4D7",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    successBannerText: {
        flex: 1,
        color: theme.colors.success,
        fontSize: 14,
        fontWeight: "500",
    },
});
