import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { styles } from './styles';

interface MockButtonProps extends TouchableOpacityProps {
  title: string;
}

export const MockButton = ({ title, ...rest }: MockButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} {...rest}>
      <Text style={styles.text}>🛠 {title}</Text>
    </TouchableOpacity>
  );
};