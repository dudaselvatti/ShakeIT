import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import { theme } from "../../styles/theme";

interface TagProps {
  label: string;
  onRemove?: () => void;
  color?: string;
}

export const Tag = ({ label, onRemove, color }: TagProps) => {
  const backgroundColor = color ? color + "20" : theme.colors.primary + "20";
  const textColor = color || theme.colors.primary;

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
