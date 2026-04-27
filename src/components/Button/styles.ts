import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  accent: {
    backgroundColor: theme.colors.accent,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  text: {
    backgroundColor: "transparent",
  },
  textBase: {
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryText: {
    color: "#FFF",
  },
  accentText: {
    color: "#FFF",
  },
  outlineText: {
    color: theme.colors.primary,
  },
  textText: {
    color: theme.colors.textLight,
  },
});
