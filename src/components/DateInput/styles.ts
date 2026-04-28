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
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.metrics.borderRadius,
    padding: theme.metrics.padding,
    justifyContent: "center", // Centraliza o texto verticalmente
    height: 54, // Mantém a mesma altura do TextInput padrão
  },
  inputText: {
    fontSize: 16,
  }
});