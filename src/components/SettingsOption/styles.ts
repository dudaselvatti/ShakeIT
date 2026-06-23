import { StyleSheet } from 'react-native';
import { ThemeType } from '../../styles/theme';

export const createStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        color: theme.colors.text,
    },
    children: {

    }
});