import React from 'react';
import { Image, ImageStyle } from 'react-native';

export interface PixelIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
  testID?: string;
}

export const PixelIcon = ({ name, size = 24, style, testID }: PixelIconProps) => {
  const getIconSource = (iconName: string) => {
    switch (iconName) {
      case 'edit-2':
      case 'edit':
        return require('../../../assets/lapis.png');
      case 'trash-2':
      case 'trash':
        return require('../../../assets/lixeira.png');
      case 'check':
      case 'check-circle':
        return require('../../../assets/check-confirmacao.png');
      case 'settings':
        return require('../../../assets/config.png');
      case 'home':
        return require('../../../assets/casa.png');
      case 'user':
      case 'users':
        return require('../../../assets/perfil-padrao.png');
      case 'calendar':
        return require('../../../assets/calendario.png');
      case 'maximize':
        return require('../../../assets/scaner-qrcode.png');
      case 'gift':
        return require('../../../assets/presente.png');
      case 'dollar-sign':
        return require('../../../assets/dinheiro.png');
      case 'gender':
        return require('../../../assets/genero.png');
      case 'alert-triangle':
        return require('../../../assets/alerta.png');
      case 'x':
        return require('../../../assets/fechar.png');
      case 'info':
        return require('../../../assets/info.png');
      case 'loader':
        return require('../../../assets/loader.png');
      case 'eye':
        return require('../../../assets/olho-aberto.png');
      case 'eye-off':
        return require('../../../assets/olho-fechado.png');
      case 'clock':
        return require('../../../assets/relogio.png');
      case 'arrow-down':
        return require('../../../assets/seta-baixo.png');
      case 'arrow-up':
        return require('../../../assets/seta-cima.png');
      case 'arrow-right':
      case 'chevron-right':
        return require('../../../assets/seta-direita.png');
      case 'chevron-down':
        return require('../../../assets/seta-dropdown.png');
      case 'arrow-left':
        return require('../../../assets/seta-esquerda.png');
      case 'chevron-left':
        return require('../../../assets/seta-voltar.png');
      case 'smile':
        return require('../../../assets/crianca.png');
      case 'twitter':
        return require('../../../assets/pet.png');
      case 'plus':
        return require('../../../assets/adcionar.png');
      case 'lock':
        return require('../../../assets/cadeado-fechado.png');
      case 'unlock':
        return require('../../../assets/cadeado-aberto.png');
      default:
        return require('../../../assets/presente.png');
    }
  };

  return (
    <Image 
      source={getIconSource(name)} 
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]} 
      testID={testID}
    />
  );
};
