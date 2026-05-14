import { StyleSheet } from 'react-native';
import { theme } from "../../../../styles/theme";

export const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'center',
        flexDirection: 'column',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
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