import React, { ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";

interface CardProps extends TouchableOpacityProps {
  children: ReactNode;
}

export const Card = ({ children, ...rest }: CardProps) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} {...rest}>
      {children}
    </TouchableOpacity>
  );
};
