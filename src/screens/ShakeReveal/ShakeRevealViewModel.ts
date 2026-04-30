import { useRef, useEffect, useState, useCallback } from "react";
import { Animated, Vibration } from "react-native";
import { Accelerometer } from "expo-sensors";

export const useShakeRevealViewModel = (navigation: any) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const explodeScale = useRef(new Animated.Value(1)).current;
  const explodeOpacity = useRef(new Animated.Value(1)).current;
  
  const [hasShaken, setHasShaken] = useState(false);

  const handleShakeDetected = useCallback(() => {
    setHasShaken(true);
    Vibration.vibrate(500);

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
      navigation.navigate("PerfilSorteado", { idUsuario: 1 });
    });
  }, [explodeScale, explodeOpacity, navigation]);

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

  useEffect(() => {
    let subscription: any;

    const subscribe = async () => {
      Accelerometer.setUpdateInterval(100);
      
      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);

        if (acceleration > 2.5 && !hasShaken) {
          handleShakeDetected();
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