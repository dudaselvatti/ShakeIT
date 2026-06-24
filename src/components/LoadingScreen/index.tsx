import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { PixelIcon as Feather } from "../PixelIcon";
import { createStyles } from './styles';
import { theme } from '../../styles/theme';
import { useAppTheme } from "../../contexts/ThemeContext";

export const LoadingScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.iconWrapper}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <Feather name="loader" size={40} color={theme.colors.primary} />
                    </Animated.View>
                </View>
                <Text style={styles.title}>ShakeIT</Text>
                <Text style={styles.subtitle}>Preparando tudo para você...</Text>
            </View>
        </View>
    );
};
