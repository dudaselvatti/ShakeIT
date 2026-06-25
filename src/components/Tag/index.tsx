import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PixelIcon as Feather } from "../PixelIcon";
import { createStyles } from "./styles";
import { useTagViewModel, Props } from "./TagViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";

export const Tag = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
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
