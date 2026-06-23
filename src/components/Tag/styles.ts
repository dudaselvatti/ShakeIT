import { StyleSheet } from "react-native";
import { ThemeType } from "../../styles/theme";

export const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginRight: 8,
    marginBottom: 8,
    maxWidth: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },
  removeButton: {
    marginLeft: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
