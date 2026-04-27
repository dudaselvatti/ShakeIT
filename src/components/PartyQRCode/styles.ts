import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    qrWrapper: {
        width: 150,
        height: 150,
        backgroundColor: theme.colors.background,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 20,
    },
});