import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.metrics.borderRadius,
    paddingHorizontal: theme.metrics.padding,
    height: 54,
  },
  prefix: {
    fontSize: 16,
    color: theme.colors.text,
    marginRight: 8,
    fontWeight: "500",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    height: "100%",
  },
});