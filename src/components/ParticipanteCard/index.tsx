import React from 'react';
import { View, Text } from 'react-native';
import { Participante } from '../../types/Participante';
import { styles } from './styles';

interface Props {
    participante: Participante;
}

export const ParticipanteCard = ({ participante }: Props) => {
    const isConfirmado = participante.perfil.isConfirmado;

    return (
        <View style={styles.container}>
            <Text style={styles.nome}>
                {participante.usuario.nome}
            </Text>
            <View style={styles.statusContainer}>
                <Text style={{ fontSize: 14 }}>
                    {isConfirmado ? '🔒' : '🔓'}
                </Text>
                {!isConfirmado && (
                    <Text style={styles.statusText}>Pendente</Text>
                )}
            </View>
        </View>
    );
}