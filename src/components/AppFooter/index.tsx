import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from '../IconButton';
import { styles } from './styles';

export const AppFooter = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <IconButton
          iconName="home"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
      
      <View style={styles.actionContainer}>
        <IconButton
          iconName="maximize"
          onPress={() => navigation.navigate('Scan')}
        />
      </View>
      
      <View style={styles.actionContainer}>
        <IconButton
          iconName="user"
          onPress={() => navigation.navigate('MeuPerfil')}
        />
      </View>
    </View>
  );
};