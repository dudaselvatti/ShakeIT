import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { useInputViewModel, Props } from "./InputViewModel";

export const Input = (props: Props) => {
  const { label, containerStyle, textInputStyle, ...textInputProps } = useInputViewModel(props);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={textInputStyle} 
        placeholderTextColor={theme.colors.textLight}
        {...textInputProps}
      />
    </View>
  );
};