import { StyleSheet } from 'react-native';
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
    },
    logoContainer: {
        marginTop: 25,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    shakeText: {
        fontSize: 28,
        color: theme.colors.text,
        fontWeight: '900',
    },
    itText: {
        fontSize: 28,
        color: theme.colors.textLight,
        fontWeight: '900',
    },
    contentContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40, 
    },
    infoContainer: {
        marginLeft: 15,
        justifyContent: 'center',
    },
    labelSecret: {
        fontSize: 18,
        color: theme.colors.text,
        fontWeight: '400',
        marginBottom: -4,
    },
    nameText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    rowDetails: {
        flexDirection: 'row',
    },
    detailText: {
        fontSize: 18,
        color: theme.colors.text,
    },
});