import React from "react";
import { View, Text, Animated } from "react-native";
import { MockButton } from "../../components/MockButton";
import { styles } from "./styles";
import { useShakeRevealViewModel } from "./ShakeRevealViewModel";

export const ShakeRevealScreen = ({ navigation }: any) => {
  const { 
    shakeAnimation, 
    explodeScale, 
    explodeOpacity, 
    simularShake, 
    hasShaken 
  } = useShakeRevealViewModel(navigation);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>O Sorteio realizado!</Text>
      
      {/* Texto dinâmico: Muda quando o utilizador chacoalha o telemóvel */}
      <Text style={styles.subtitle}>
        {hasShaken ? "Preparando a surpresa..." : "Chacoalhe o celular para descobrir o seu amigo secreto..."}
      </Text>

      <Animated.View 
        style={[
          styles.box, 
          { 
            opacity: explodeOpacity, // Controla o fade out
            transform: [
              { translateX: hasShaken ? 0 : shakeAnimation }, // Pára de tremer quando explode
              { scale: explodeScale } // Aumenta de tamanho drasticamente
            ] 
          }
        ]}
      >
        <Text style={styles.emoji}>🎁</Text>
      </Animated.View>

      <View style={styles.mockButtonContainer}>
        {/* Esconde o botão se a animação já estiver a correr */}
        {!hasShaken && (
          <MockButton 
            title="Simular Shake Físico" 
            onPress={simularShake} 
          />
        )}
      </View>
    </View>
  );
};