import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createStyles } from "./styles";
import { useDateInputViewModel, Props } from "./DateInputViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";

export const DateInput = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const { 
    label,
    display,
    value,
    dateText,
    containerStyle,
    minimumDate,
    maximumDate,
    touchableOpacityTextStyles,
    showPicker,
    openPicker,
    //closePicker, //Não utilizado atualmente, mas pode ser útil no futuro
    handleChange,
    testID,
  } = useDateInputViewModel(props);

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
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
          display={display}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};