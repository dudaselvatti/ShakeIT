import { StyleSheet } from "react-native";
import { ThemeType } from "../../styles/theme";

export const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.metrics.borderRadius,
  },
  input: {
    flex: 1,
    padding: theme.metrics.padding,
    fontSize: 16,
    color: theme.colors.text,
  },
  eyeIcon: {
    padding: theme.metrics.padding,
    justifyContent: 'center',
    alignItems: 'center',
  }
});