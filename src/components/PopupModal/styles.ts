import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.metrics.borderRadius,
    padding: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  modalButton: {
    width: "auto",
    minWidth: 100,
    height: 45,
  },
});
