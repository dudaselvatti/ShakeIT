import { StyleSheet, Dimensions } from "react-native";
import { ThemeType } from "../../styles/theme";

const { height } = Dimensions.get("window");

export const createStyles = (theme: ThemeType) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "flex-end",
    },
    container: {
        width: "100%",
        maxHeight: height * 0.8,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        color: theme.colors.text,
        fontWeight: "bold",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    empty: {
        color: theme.colors.textLight,
        textAlign: "center",
        marginTop: 16,
        fontSize: 16,
    },
    depItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    depInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    depName: {
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: "500",
        marginLeft: 12,
    },
    closeBtn: {
        marginTop: 24,
        width: "100%",
    }
});
