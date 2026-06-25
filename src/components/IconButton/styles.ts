import { StyleSheet } from "react-native";
import { ThemeType } from "../../styles/theme";

export const createStyles = (theme: ThemeType) => StyleSheet.create({
  base: {
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  transparent: {
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 8,
  },
  solid: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: theme.metrics.borderRadius,
  },
});
