import { StyleSheet, Platform, StatusBar } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textLight,
    marginBottom: 16,
    paddingHorizontal: 24,
    textTransform: "uppercase",
    letterSpacing: 1,
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
