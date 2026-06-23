import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import { createStyles } from "./styles";
import { theme } from "../../styles/theme";
import { useSelectInputViewModel, Props } from "./SelectInputViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";

export const SelectInput = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const { label, selectedValue, onValueChange, options, style, containerStyle, displayValue, isPlaceholder, testID } = useSelectInputViewModel(props);

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.dropdownVisual, style]}>
        <View style={styles.innerContainer} pointerEvents="none">
          <Text style={isPlaceholder ? styles.dropdownPlaceholderText : styles.dropdownValueText}>
            {displayValue}
          </Text>
          <Feather name="chevron-down" size={16} color={theme.colors.textLight} style={styles.chevron} />
        </View>

        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Selecione..." value="" />

          {options.map((option) => (
            <Picker.Item
              key={option.key}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};
