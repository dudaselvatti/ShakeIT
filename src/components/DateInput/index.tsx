import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./styles";
import { useDateInputViewModel, Props } from "./DateInputViewModel";

export const DateInput = (props: Props) => {
  const { 
    label,
    value,
    dateText,
    containerStyle,
    touchableOpacityTextStyles,
    showPicker,
    openPicker,
    //closePicker, //Não utilizado atualmente, mas pode ser útil no futuro
    handleChange,
  } = useDateInputViewModel(props);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={styles.input} 
        onPress={openPicker}
        activeOpacity={0.7}
      >
        <Text style={touchableOpacityTextStyles}>{dateText}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};