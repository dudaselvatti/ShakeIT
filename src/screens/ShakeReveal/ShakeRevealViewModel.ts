import { useRef, useEffect, useState, useCallback } from "react";
import { Animated, Vibration } from "react-native";
import { Accelerometer } from "expo-sensors";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { getDrawResultByGiverProfileId } from "../../services/cloud/DrawResult/DrawResultDb";
import { getPartyParticipantByUserIdAndPartyId } from "../../services/cloud/PartyParticipant/PartyParticipantDb";

import { updatePartyParticipant } from "../../services/cloud/PartyParticipant/PartyParticipantDb";

export function useShakeRevealViewModel({ route, navigation }: any) {
  const { partyId } = route.params;
  const { usuarioAtual } = useAuth();

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const explodeScale = useRef(new Animated.Value(1)).current;
  const explodeOpacity = useRef(new Animated.Value(1)).current;
  
  const [hasShaken, setHasShaken] = useState(false);

  const navigateToDrawnProfile = useCallback(async () => {
    if (!usuarioAtual?.id) {
      return;
    }
    try {
      const participant = await getPartyParticipantByUserIdAndPartyId(usuarioAtual.id, partyId);
      if (!participant) {
        throw new Error("Participante do usuário não encontrado");
      }
      
      // Update has_revealed_draw
      if (!participant.perfil.has_revealed_draw) {
        await updatePartyParticipant(participant.perfil.id, {
          "perfil.has_revealed_draw": true,
          "has_revealed_draw": true
        } as any);
      }

      const giverProfileId = participant.perfil.id;
      const drawResult = await getDrawResultByGiverProfileId(partyId, giverProfileId);
      if (!drawResult) {
        throw new Error("Resultado do sorteio não encontrado");
      }
      navigation.navigate("PerfilSorteado", { partyId });
    } catch (error) {
      console.error("Erro ao buscar perfil sorteado:", error);
    }
  }, [partyId, usuarioAtual, navigation]);

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
      navigateToDrawnProfile();
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

    const loop = Animated.loop(shakeSequence);
    loop.start();

    return () => {
      loop.stop();
    };
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