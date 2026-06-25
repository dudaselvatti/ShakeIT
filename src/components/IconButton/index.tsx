import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useIconButtonViewModel, Props } from "./IconButtonViewModel"
import { PixelIcon as Feather } from "../PixelIcon";

export const IconButton = (props: Props) => {
  const { iconName, iconColor, iconSize, touchableOpacityStyles, ...touchableOpacityProps } = useIconButtonViewModel(props)

  return (
    <TouchableOpacity
      style={touchableOpacityStyles}
      activeOpacity={0.8}
      {...touchableOpacityProps}
    >
      <Feather name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};
