import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";
import { useSelectInputViewModel, Props } from "./SelectInputViewModel";

export const SelectInput = (props: Props) => {
  const { label, selectedValue, onValueChange, options } = useSelectInputViewModel(props)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Selecione..." value="" />

        {options.map((option) => (
          <Picker.Item
            key={option}
            label={option}
            value={option}
          />
        ))}
      </Picker>
    </View>
  );
};