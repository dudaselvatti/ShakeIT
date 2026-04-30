import { StyleSheet, Platform, StatusBar } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
  },
  headerPlaceholder: {
    height: 80,
    justifyContent: "flex-end",
    marginBottom: 24,
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
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  fabContainer: {
    position: "absolute",
    right: 24,
    bottom: 40,
  },
});
