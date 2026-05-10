import React from "react";
import { View, Text, TextInput } from "react-native";
import { useCurrencyInputViewModel, Props } from './CurrencyInputViewModel';
import { styles } from "./styles";
import { theme } from "../../styles/theme";

export const CurrencyInput = (props: Props) => {
  const { handleTextChange, label, containerStyle, onChangeText, value, ...textInputProps} = useCurrencyInputViewModel(props);
  
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
          maxLength={12}
          {...textInputProps}
        />
      </View>
    </View>
  );
};