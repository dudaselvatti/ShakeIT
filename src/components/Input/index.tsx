import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { useInputViewModel, Props } from "./InputViewModel";

export const Input = (props: Props) => {
  const { label, containerStyle, textInputStyle, ...textInputProps } = useInputViewModel(props);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput 
        style={textInputStyle} 
        placeholderTextColor={theme.colors.textLight}
        {...textInputProps}
      />
    </View>
  );
};