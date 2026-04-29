import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.surface,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.surface,
    textAlign: "center",
    marginBottom: 60,
    opacity: 0.9,
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 80,
  },
  emoji: {
    fontSize: 80,
  },
  mockButtonContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    paddingHorizontal: 24,
  }
});