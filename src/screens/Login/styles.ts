import { StyleSheet, Platform, StatusBar } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsView: {
    flex: 1, //Talvez fique um pouco estranho, mas é para os botões não ficarem nem muito perto, nem muito longe dos inputs
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  registrationButton: {
    padding: 24,
    backgroundColor: theme.colors.background,
    color: theme.colors.primary,
  },
  forgotMyPasswordButton: {
    padding: 24,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 14,
    marginTop: -16,
    marginBottom: 16,
    marginLeft: 4,
  },
  firebaseErrorText: {
    color: theme.colors.danger,
    fontSize: 20,
    textAlign: 'center'
  }
});