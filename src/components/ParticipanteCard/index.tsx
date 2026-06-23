import React from 'react';
import { View, Text } from 'react-native';
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
                <Text style={{ fontSize: 14 }}>{statusIcon}</Text>
                {!isConfirmado && (<Text style={styles.statusText}>{statusText}</Text>)}
            </View>
        </View>
    );
};