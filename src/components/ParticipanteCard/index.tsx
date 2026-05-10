import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { useParticipanteCardViewModel, Props } from "./ParticipanteCardViewModel";

export const ParticipanteCard = (props: Props) => {
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