import { useRef, useEffect, useState, useCallback } from "react";
import { Animated, Vibration } from "react-native";
import { Accelerometer } from "expo-sensors";


export const useShakeRevealViewModel = (navigation: any) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const explodeScale = useRef(new Animated.Value(1)).current; // Controla o tamanho da explosão
  const explodeOpacity = useRef(new Animated.Value(1)).current; // Controla o desaparecimento
  
  const [hasShaken, setHasShaken] = useState(false);

  // 1. Efeito de Tremor (Fica em loop até o utilizador chacoalhar)
  useEffect(() => {
    if (hasShaken) return; // Se já chacoalhou, pára o tremor base

    const shakeSequence = Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.delay(1500),
    ]);

    Animated.loop(shakeSequence).start();
  }, [shakeAnimation, hasShaken]);

  // 2. Monitorização do Acelerómetro (Ouvidos do telemóvel)
  useEffect(() => {
    let subscription: any;

    const subscribe = async () => {
      Accelerometer.setUpdateInterval(100); // Lê o sensor a cada 100ms
      
      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        
        // Fórmula de força G (Teorema de Pitágoras em 3D)
        const acceleration = Math.sqrt(x * x + y * y + z * z);

        // Threshold de 2.5 é o ideal para um "shake" intencional
        if (acceleration > 2.5 && !hasShaken) {
          handleShakeDetected();
        }
      });
    };

    if (!hasShaken) {
      subscribe();
    }

    // Função de limpeza (Unsubscribe) importantíssima para evitar Memory Leaks
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [handleShakeDetected, hasShaken]);

  // 3. O Evento de Explosão e Transição (Agora protegido com useCallback)
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