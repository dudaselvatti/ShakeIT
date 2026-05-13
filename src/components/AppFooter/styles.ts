import { StyleSheet, Platform } from 'react-native';
import { theme } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
});