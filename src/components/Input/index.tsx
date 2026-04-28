import React from "react";
import { View, Text, TextInput, TextInputProps, ViewStyle } from "react-native";
import { styles } from "./styles";
import { theme } from "../../styles/theme";

// Estendemos as props nativas do TextInput e adicionamos as nossas
interface InputProps extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle; // Para podermos passar estilos como "width: 48%"
}

export const Input = ({ label, containerStyle, style, ...rest }: InputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={[styles.input, style]} 
        placeholderTextColor={theme.colors.textLight}
        {...rest} // Repassa todas as outras props (value, onChangeText, keyboardType)
      />
    </View>
  );
};