import { StyleSheet } from "react-native";
import { ThemeType } from "../../styles/theme";

export const createStyles = (theme: ThemeType) => StyleSheet.create({
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
  danger: {
    backgroundColor: "#FFDCDC",
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  redNoOutline: {
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
  dangerText: {
    color: theme.colors.danger,
  },
  redNoOutlineText: {
    color: theme.colors.primary,
  },
});
