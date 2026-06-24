import { StyleSheet } from "react-native";
import { ThemeType } from "../../styles/theme";

export const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerPlaceholder: {
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    color: theme.colors.textLight,
    fontSize: 14,
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  fabContainer: {
    position: "absolute",
    right: 24,
    bottom: 90,
  },
});
