import React, { useState } from "react";
import { View, Text, TouchableOpacity, ViewStyle, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./styles";
import { theme } from "../../styles/theme";

interface DateInputProps {
  label: string;
  value: Date | undefined;
  onChangeDate: (date: Date) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

export const DateInput = ({ 
  label, 
  value, 
  onChangeDate, 
  placeholder = "DD/MM/AAAA", 
  containerStyle 
}: DateInputProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const formattedDate = value ? value.toLocaleDateString("pt-BR") : "";

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (event.type === "set" && selectedDate) {
      setShowPicker(false);
      onChangeDate(selectedDate);
    } else {
       setShowPicker(false);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowPicker(true)} 
        activeOpacity={0.7}
      >
        <Text style={[
          styles.inputText, 
          { color: value ? theme.colors.text : theme.colors.textLight }
        ]}>
          {value ? formattedDate : placeholder}
        </Text>
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