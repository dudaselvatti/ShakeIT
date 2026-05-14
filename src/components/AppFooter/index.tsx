import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconButton } from '../IconButton';
import { styles } from './styles';

export interface AppFooterProps {
  onNavigateIntercept?: (screen: string) => void;
}

export const AppFooter = ({ onNavigateIntercept }: AppFooterProps = {}) => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const handleNavigate = (screen: string) => {
    if (route.name === screen) return;

    if (onNavigateIntercept) {
      onNavigateIntercept(screen);
      return;
    }

    const tabs = ['Home', 'Scan', 'MeuPerfil'];
    const currentIndex = tabs.indexOf(route.name);
    const targetIndex = tabs.indexOf(screen);
    
    let animation = 'slide_from_right';
    if (currentIndex !== -1 && targetIndex !== -1) {
      animation = targetIndex > currentIndex ? 'slide_from_right' : 'slide_from_left';
    }

    navigation.navigate(screen, { animation });
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <IconButton
          iconName="home"
          onPress={() => handleNavigate('Home')}
        />
      </View>
      
      <View style={styles.actionContainer}>
        <IconButton
          iconName="maximize"
          onPress={() => handleNavigate('Scan')}
        />
      </View>
      
      <View style={styles.actionContainer}>
        <IconButton
          iconName="user"
          onPress={() => handleNavigate('MeuPerfil')}
        />
      </View>
    </View>
  );
};