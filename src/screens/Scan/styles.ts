import { StyleSheet, Dimensions } from "react-native";
import { theme } from "../../styles/theme";

const { width, height } = Dimensions.get("window");
const overlayColor = "rgba(0,0,0,0.6)";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  maskHole: {
    position: "absolute",
    width: width * 0.7 + Math.max(width, height) * 2,
    height: width * 0.7 + Math.max(width, height) * 2,
    borderRadius: 16 + Math.max(width, height),
    borderWidth: Math.max(width, height),
    borderColor: overlayColor,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  transparentOverlay: {
    width: width * 0.7,
    height: width * 0.7,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  bottomInstructionContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 40,
    marginTop: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  permissionSubText: {
    fontSize: 14,
    fontWeight: "normal",
    color: theme.colors.textLight || "#6C757D",
    textAlign: "center",
    marginBottom: 30,
  },
});
