import React from 'react';
import { View, Text, SafeAreaView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { createStyles } from './styles';
import { theme } from '../../styles/theme';
import { useWelcomeViewModel } from './WelcomeViewModel';
import { useAppTheme } from "../../contexts/ThemeContext";

export const WelcomeScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { handleLogin, handleRegister } = useWelcomeViewModel();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <Image source={require('../../../assets/logo-pixel.png')} style={{ width: 150, height: 150, resizeMode: 'contain' }} />
                </View>
                
                <Text style={styles.title}>Bem vindo ao ShakeIT</Text>
                
                <Text style={styles.description}>
                    A forma mais fácil e divertida de organizar sorteios e compartilhar suas listas de desejos com amigos e familiares!
                </Text>
            </View>

            <View style={styles.footer}>
                <Button 
                    title="Criar uma conta" 
                    onPress={handleRegister} 
                />
                <Button 
                    title="Já tenho uma conta" 
                    onPress={handleLogin} 
                    variant="outline"
                    style={styles.loginButton}
                />
            </View>
        </SafeAreaView>
    );
};
