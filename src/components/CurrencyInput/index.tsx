import React from "react";
import { View, Text, TextInput, TextInputProps, ViewStyle } from "react-native";
import { styles } from "./styles";
import { theme } from "../../styles/theme";

// Omitimos o onChangeText padrão para usarmos o nosso customizado
interface CurrencyInputProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  containerStyle?: ViewStyle;
  onChangeText?: (text: string) => void;
}

export const CurrencyInput = ({ 
  label, 
  containerStyle, 
  onChangeText, 
  value, 
  ...rest 
}: CurrencyInputProps) => {
  
  const handleTextChange = (text: string) => {
    if (!onChangeText) return;
    let rawValue = text.replace(/\D/g, "");
    if (rawValue === "") {
      onChangeText("");
      return;
    }
    let numericValue = (parseInt(rawValue, 10) / 100).toFixed(2);
    let [intPart, decPart] = numericValue.split(".");
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    onChangeText(`${intPart},${decPart}`);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputWrapper}>
        <Text style={styles.prefix}>R$</Text>
        
        <TextInput 
          style={styles.input} 
          placeholderTextColor={theme.colors.textLight}
          keyboardType="numeric"
          value={value}
          onChangeText={handleTextChange}
          maxLength={12} // Limita a entrada para evitar números muito grandes (ex: 999.999,99)
          {...rest}
        />
      </View>
    </View>
  );
};