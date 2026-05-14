import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.metrics.borderRadius,
        padding: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: theme.colors.border,
    }
});
