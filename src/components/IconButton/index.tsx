import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useIconButtonViewModel, Props } from "./IconButtonViewModel"

export const IconButton = (props: Props) => {
  const { iconName, iconColor, iconSize, touchableOpacityStyles, ...touchableOpacityProps } = useIconButtonViewModel(props)

  return (
    <TouchableOpacity
      style={touchableOpacityStyles}
      activeOpacity={0.8}
      {...touchableOpacityProps}
    >
      <Feather
        name={iconName}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};
