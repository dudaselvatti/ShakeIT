import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    header: {
        backgroundColor: theme.colors.surface,
        padding: theme.metrics.padding,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        zIndex: 2,
        justifyContent: 'space-between',
    },
    leftContainer: {
        minWidth: 40,
        marginLeft: -8,
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 3,
    },
    rightContainer: {
        minWidth: 40,
        marginRight: -8,
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 3,
    },
    headerTitle: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        pointerEvents: 'none',
        zIndex: 1,
    },
});