import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "../../styles/theme";

interface IconButtonProps extends TouchableOpacityProps {
  iconName: keyof typeof Feather.glyphMap;
  variant?: "fab" | "transparent";
  color?: string;
  size?: number;
}

export const IconButton = ({
  iconName,
  variant = "transparent",
  color,
  size,
  style,
  ...rest
}: IconButtonProps) => {
  const defaultColor =
    variant === "fab" ? theme.colors.surface : theme.colors.text;
  const defaultSize = variant === "fab" ? 32 : 24;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style]}
      activeOpacity={0.8}
      {...rest}
    >
      <Feather
        name={iconName}
        size={size || defaultSize}
        color={color || defaultColor}
      />
    </TouchableOpacity>
  );
};
