import { StyleSheet } from "react-native";
import { ThemeType } from "../../styles/theme";



export const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  guideText: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 2,
    marginBottom: 2,
  },
  restrictionView: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  RestrictionDirection: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  RestrictionDirectionArrows: {
    flexDirection: "row",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  activeBlockDependentDraw: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});