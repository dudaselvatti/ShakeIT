import { StyleSheet } from 'react-native';
import { ThemeType } from '../../styles/theme';

export const createStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 8,
        fontWeight: "600",
    },
    touchableOpacity: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.surface,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    placeholder: {
        color: theme.colors.text,
        textAlign: "center",
    },
});