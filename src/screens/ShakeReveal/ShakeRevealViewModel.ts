import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export const useShakeRevealViewModel = (navigation: any) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shakeSequence = Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.delay(1500),
    ]);

    Animated.loop(shakeSequence).start();
  }, [shakeAnimation]);

  const simularShake = () => {
    navigation.navigate("PerfilSorteado", { idUsuario: 11 }); //Como não temos lógica de sorteio, usa-se idUsuario 11 para testar a tela 7
  };

  return {
    shakeAnimation,
    simularShake,
  };
};