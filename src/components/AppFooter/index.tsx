import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity, Image } from 'react-native';
import { createStyles } from './styles';
import { useAppTheme } from "../../contexts/ThemeContext";

export interface AppFooterProps {
  onNavigateIntercept?: (screen: string) => void;
}

export const AppFooter = ({ onNavigateIntercept }: AppFooterProps = {}) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
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
        <TouchableOpacity testID="icon-button-home" onPress={() => handleNavigate('Home')} style={{ alignItems: 'center', padding: 8 }}>
          <Image 
            source={require('../../../assets/casa.png')} 
            style={{ 
              width: 28, 
              height: 28, 
              opacity: route.name === 'Home' ? 1 : 0.5 
            }} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity testID="icon-button-maximize" onPress={() => handleNavigate('Scan')} style={{ alignItems: 'center', padding: 8 }}>
          <Image 
            source={require('../../../assets/scaner-qrcode.png')} 
            style={{ 
              width: 28, 
              height: 28, 
              opacity: route.name === 'Scan' ? 1 : 0.5 
            }} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity testID="icon-button-user" onPress={() => handleNavigate('MeuPerfil')} style={{ alignItems: 'center', padding: 8 }}>
          <Image 
            source={require('../../../assets/perfil-padrao.png')} 
            style={{ 
              width: 28, 
              height: 28, 
              opacity: route.name === 'MeuPerfil' ? 1 : 0.5 
            }} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};