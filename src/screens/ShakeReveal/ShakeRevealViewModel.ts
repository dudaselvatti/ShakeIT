import { useRef, useEffect, useState, useCallback } from "react";
import { Animated, Vibration } from "react-native";
import { Accelerometer } from "expo-sensors";

export const useShakeRevealViewModel = (navigation: any) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const explodeScale = useRef(new Animated.Value(1)).current;
  const explodeOpacity = useRef(new Animated.Value(1)).current;
  
  const [hasShaken, setHasShaken] = useState(false);

  // 1. A FUNÇÃO PRECISA VIR ANTES (Declaramos antes de usar)
  const handleShakeDetected = useCallback(() => {
    setHasShaken(true); // Bloqueia novos shakes acidentais
    Vibration.vibrate(500); // Feedback Háptico!

    // Animação de "Explosão"
    Animated.parallel([
      Animated.timing(explodeScale, {
        toValue: 8,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(explodeOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigation.navigate("RevealResult");
    });
  }, [explodeScale, explodeOpacity, navigation]);

  // 2. Efeito de Tremor base
  useEffect(() => {
    if (hasShaken) return;

    const shakeSequence = Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.delay(1500),
    ]);

    Animated.loop(shakeSequence).start();
  }, [shakeAnimation, hasShaken]);

  // 3. Monitorização do Acelerómetro
  useEffect(() => {
    let subscription: any;

    const subscribe = async () => {
      Accelerometer.setUpdateInterval(100);
      
      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);

        if (acceleration > 2.5 && !hasShaken) {
          handleShakeDetected(); // Agora funciona perfeitamente pois a função já foi declarada acima!
        }
      });
    };

    if (!hasShaken) {
      subscribe();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [hasShaken, handleShakeDetected]);

  // Botão Mock para testes na equipa
  const simularShake = () => {
    if (!hasShaken) handleShakeDetected();
  };

  return {
    shakeAnimation,
    explodeScale,
    explodeOpacity,
    simularShake,
    hasShaken
  };
};