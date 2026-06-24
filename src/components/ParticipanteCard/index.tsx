import React from 'react';
import { View, Text, Image } from 'react-native';
import { createStyles } from './styles';
import { useParticipanteCardViewModel, Props } from "./ParticipanteCardViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";

export const ParticipanteCard = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { nome, statusIcon, statusText, isConfirmado } = useParticipanteCardViewModel(props);
    
    return (
        <View style={styles.container}>
            <Text style={styles.nome}>{nome}</Text>
            <View style={styles.statusContainer}>
                <Image source={statusIcon} style={{ width: 24, height: 24, resizeMode: 'contain' }} testID="status-icon" />
                {!isConfirmado && (<Text style={styles.statusText}>{statusText}</Text>)}
            </View>
        </View>
    );
};