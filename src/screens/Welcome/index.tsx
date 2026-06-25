import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PixelIcon as Feather } from "../../components/PixelIcon";
import { Button } from '../../components/Button';
import { createStyles } from './styles';
import { theme } from '../../styles/theme';
import { useWelcomeViewModel } from './WelcomeViewModel';
import { useAppTheme } from "../../contexts/ThemeContext";

export const WelcomeScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { handleLogin, handleRegister } = useWelcomeViewModel();
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16 }}>
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                    <Image 
                        source={require('../../../assets/config.png')} 
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain" 
                    />
                </TouchableOpacity>
            </View>
            <View style={[styles.content, { marginTop: -24 }]}>
                <View style={styles.iconWrapper}>
                    <Image source={require('../../../assets/logo-pixel.png')} style={{ width: 150, height: 150, resizeMode: 'contain' }} />
                </View>
                
                <Text style={styles.title}>Bem-vindo(a) ao ShakeIT!</Text>
                
                <Text style={styles.description}>
                    A magia do Amigo Secreto na palma da sua mão! Crie eventos, adicione suas listas de desejos e sorteie com um chacoalhar!
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
