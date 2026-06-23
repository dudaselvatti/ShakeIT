import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions, Animated } from 'react-native';
import Svg, { Defs, Mask, Rect, Circle, G, Text as SvgText, Pattern, Image } from 'react-native-svg';

interface ScratchCardProps {
  onReveal: () => void;
  width: number;
  height: number;
  underneathComponent: React.ReactNode;
}

export const ScratchCard = ({ onReveal, width, height, underneathComponent }: ScratchCardProps) => {
  const [paths, setPaths] = useState<{ x: number; y: number }[]>([]);
  const revealedRef = useRef(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // We consider "revealed" if they made enough scratch points (e.g. 50 points)
  const SCRATCH_THRESHOLD = 80;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (revealedRef.current) return;
        
        const { locationX, locationY } = evt.nativeEvent;
        
        setPaths(prev => {
          const newPaths = [...prev, { x: locationX, y: locationY }];
          if (newPaths.length > SCRATCH_THRESHOLD && !revealedRef.current) {
            revealedRef.current = true;
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => {
              onReveal();
            });
          }
          return newPaths;
        });
      },
    })
  ).current;

  return (
    <View style={{ width, height, position: 'relative' }}>
      <View style={{ width, height, position: 'absolute', top: 0, left: 0, zIndex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {underneathComponent}
      </View>
      <Animated.View 
        style={{ width, height, position: 'absolute', top: 0, left: 0, zIndex: 2, opacity: fadeAnim }} 
        {...panResponder.panHandlers}
      >
        <Svg width={width} height={height}>
          <Defs>
            <Mask id="mask">
              <Rect x="0" y="0" width="100%" height="100%" fill="white" />
              {paths.map((p, index) => (
                <Circle key={index} cx={p.x} cy={p.y} r="35" fill="black" />
              ))}
            </Mask>
            <Pattern id="scratchPattern" patternUnits="userSpaceOnUse" width="40" height="40">
                <Rect width="40" height="40" fill="#bbb" />
                <Circle cx="20" cy="20" r="1" fill="#999" />
            </Pattern>
          </Defs>

          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#scratchPattern)"
            mask="url(#mask)"
            rx="16"
            ry="16"
          />
          <SvgText
            x="50%"
            y="50%"
            fill="#555"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            mask="url(#mask)"
          >
            Raspadinha!
          </SvgText>
          <SvgText
            x="50%"
            y="65%"
            fill="#777"
            fontSize="14"
            textAnchor="middle"
            alignmentBaseline="middle"
            mask="url(#mask)"
          >
            Passe o dedo para revelar
          </SvgText>
        </Svg>
      </Animated.View>
    </View>
  );
};
