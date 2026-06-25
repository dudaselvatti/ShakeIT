import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { PixelIcon as Feather } from "../PixelIcon";
import { createStyles } from "./styles";
import { theme } from "../../styles/theme";
import { useInputViewModel, Props } from "./InputViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";

export const Input = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const { 
    label, 
    containerStyle, 
    mergedInputContainerStyle,
    textInputStyle, 
    isPassword,
    secureTextEntry,
    isPasswordVisible,
    togglePasswordVisibility,
    ...textInputProps 
  } = useInputViewModel(props);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={mergedInputContainerStyle}>
        <TextInput 
          style={textInputStyle} 
          placeholderTextColor={theme.colors.textLight}
          secureTextEntry={secureTextEntry}
          {...textInputProps}
        />
        {isPassword && (
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={togglePasswordVisibility}
          >
            <Feather 
              name={isPasswordVisible ? "eye" : "eye-off"} 
              size={20} 
              color={theme.colors.textLight} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};