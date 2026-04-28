import React from "react";
import { View, Text, TextInput, TextInputProps, ViewStyle } from "react-native";
import { styles } from "./styles";
import { theme } from "../../styles/theme";

interface InputProps extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle;
}

export const Input = ({ label, containerStyle, style, ...rest }: InputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={[styles.input, style]} 
        placeholderTextColor={theme.colors.textLight}
        {...rest}
      />
    </View>
  );
};