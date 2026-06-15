import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const arrowColor = theme.colors.textLight;
export const xColor = theme.colors.danger;

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  text: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  personName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
});