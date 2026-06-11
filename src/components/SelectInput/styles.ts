import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		color: theme.colors.text,
		marginBottom: 8,
		fontWeight: "600",
	},
	dropdownVisual: {
		backgroundColor: theme.colors.surface,
		borderWidth: 1,
		borderColor: theme.colors.border,
		borderRadius: theme.metrics.borderRadius,
		overflow: "hidden",
		position: "relative",
	},
	innerContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 20, // Taller padding for legibility/comfort, adjusted to 20
	},
	dropdownValueText: {
		fontSize: 16,
		color: theme.colors.text,
		fontWeight: "500",
	},
	dropdownPlaceholderText: {
		fontSize: 16,
		color: theme.colors.textLight,
	},
	picker: {
		position: "absolute",
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		opacity: 0.01,
		width: "100%",
		height: "100%",
	},
	chevron: {
		marginLeft: 8,
	},
});