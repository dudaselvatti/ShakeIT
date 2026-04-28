import React, { useState } from "react";
import { View, Text, TouchableOpacity, ViewStyle, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./styles";
import { theme } from "../../styles/theme";

interface DateInputProps {
  label: string;
  value: Date | undefined; // Agora recebemos um objeto Date real
  onChangeDate: (date: Date) => void; // Função que devolve a data escolhida
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

  // Formata a data para exibir no input (ex: 25/12/2026)
  const formattedDate = value ? value.toLocaleDateString("pt-BR") : "";

  const handleChange = (event: any, selectedDate?: Date) => {
    // Fecha o calendário assim que o utilizador escolhe uma data
    setShowPicker(Platform.OS === "ios"); 
    
    // Se o utilizador cancelou, selectedDate vem indefinido, por isso verificamos
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

      {/* Renderiza o calendário apenas quando showPicker for true */}
      {showPicker && (
        <DateTimePicker
          value={value || new Date()} // Se não tiver data, mostra a data de hoje
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={new Date()} // Impede o utilizador de escolher datas que já passaram!
        />
      )}
    </View>
  );
};