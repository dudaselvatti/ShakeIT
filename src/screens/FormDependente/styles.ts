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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 12,
        marginBottom: 8,
    },
    interestsCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.metrics.borderRadius,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    addInterestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 4,
    },
    addInterestInput: {
        flex: 1,
        marginRight: 8,
        marginBottom: 0,
    },
    addInterestBtn: {
        width: 48,
        height: 48,
        marginTop: 22,
    },
});
