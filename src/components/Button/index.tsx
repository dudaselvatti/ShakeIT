import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useButtonViewModel, Props } from './ButtonViewModel'

export const Button = (props: Props) => {
  const { title, isLoading, isDisabled, loadingColor, touchableOpacityStyles, textStyles, touchableOpacityProps } = useButtonViewModel(props);
  return (
    <TouchableOpacity
      style={touchableOpacityStyles}
      activeOpacity={0.8}
      disabled={isDisabled}
      {...touchableOpacityProps}
    >
      {isLoading ? (
        <ActivityIndicator color={loadingColor}/>
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
