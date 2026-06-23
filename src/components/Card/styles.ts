import { StyleSheet } from 'react-native';
import { ThemeType } from '../../styles/theme';

export const createStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.metrics.borderRadius,
        padding: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: theme.colors.border,
    }
});
