import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import { useTagViewModel, Props } from "./TagViewModel";

export const Tag = (props: Props) => {
  const { label, onRemove, backgroundColor, textColor } = useTagViewModel(props)
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          accessibilityLabel="Remover tag"
          accessibilityRole="button"
        >
          <Feather name="x" size={14} color={textColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};
