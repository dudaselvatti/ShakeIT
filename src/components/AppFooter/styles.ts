import { StyleSheet } from 'react-native';
import { ThemeType } from '../../styles/theme';

export const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
});