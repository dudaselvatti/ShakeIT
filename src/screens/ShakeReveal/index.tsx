import React from "react";
import { View, Text, Animated } from "react-native";
import { Button } from "../../components/Button";
import { styles } from "./styles";
import { useShakeRevealViewModel } from "./ShakeRevealViewModel";

export const ShakeRevealScreen = ({ navigation }: any) => {
  const { shakeAnimation, simularShake } = useShakeRevealViewModel(navigation);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>O Sorteio realizado!</Text>
      <Text style={styles.subtitle}>Chacoalhe o celular para descobrir o seu amigo secreto...</Text>

      <Animated.View style={[styles.box, { transform: [{ translateX: shakeAnimation }] }]}>
        <Text style={styles.emoji}>🎁</Text>
      </Animated.View>

      <View style={styles.mockButtonContainer}>
        <Button 
          title="Simular Shake (Mock T08)" 
          onPress={simularShake}
        />
      </View>
    </View>
  );
};