import React from "react";
import { View, Text, Animated, Image } from "react-native";
import { createStyles } from "./styles";
import { useShakeRevealViewModel } from "./ShakeRevealViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";
import { ScratchCard } from "../../components/ScratchCard";
import { Dimensions } from "react-native";

export const ShakeRevealScreen = ({ navigation }: any) => {
    const { theme, isScratchMode } = useAppTheme();
    const styles = createStyles(theme);
    const { 
    shakeAnimation, 
    explodeScale, 
    explodeOpacity, 
    hasShaken,
    simularShake
  } = useShakeRevealViewModel(navigation);
  
  const handleRevealScratch = () => {
    // Navigate immediately or call simularShake which handles the navigation logic
    simularShake();
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>O Sorteio realizado!</Text>
      <Text style={styles.subtitle}>
        {hasShaken ? "Preparando a surpresa..." : isScratchMode ? "Raspe o cartão para descobrir o seu amigo secreto!" : "Chacoalhe o celular para descobrir o seu amigo secreto..."}
      </Text>


      {isScratchMode ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
            <ScratchCard 
                width={300} 
                height={300} 
                onReveal={handleRevealScratch} 
                underneathComponent={
                    <View style={{ width: 300, height: 300, backgroundColor: theme.colors.surface, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.primary }}>
                        <Image source={require('../../../assets/presente.png')} style={{ width: 64, height: 64, resizeMode: 'contain' }} />
                        <Text style={{ fontSize: 20, color: theme.colors.text, marginTop: 16, fontWeight: 'bold' }}>Revelado!</Text>
                    </View>
                }
            />
        </View>
      ) : (
        <Animated.View 
            style={[
            styles.box, 
            { 
                opacity: explodeOpacity,
                transform: [
                { translateX: hasShaken ? 0 : shakeAnimation },
                { scale: explodeScale }
                ] 
            }
            ]}
        >
            <Image source={require('../../../assets/presente.png')} style={{ width: 120, height: 120, resizeMode: 'contain' }} testID="present-image" />
        </Animated.View>
      )}


    </View>
  );
};