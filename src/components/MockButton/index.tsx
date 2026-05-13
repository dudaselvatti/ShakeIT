import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';
import { useMockButtonViewModel, Props } from './MockButtonViewModel';


export const MockButton = (props: Props) => {
  const { title, ...touchableOpacityProps } = useMockButtonViewModel(props)

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} {...touchableOpacityProps}>
      <Text style={styles.text}>🛠 {title}</Text>
    </TouchableOpacity>
  );
};