import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const iconColor = theme.colors.textLight;

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 1,
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