import React from "react";
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";
import { theme } from "../../styles/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "accent" | "outline" | "text";
  isLoading?: boolean;
}

export const Button = ({
  title,
  variant = "primary",
  isLoading = false,
  style,
  ...rest
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style]}
      activeOpacity={0.8}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "text"
              ? theme.colors.primary
              : "#FFF"
          }
        />
      ) : (
        <Text style={[styles.textBase, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
