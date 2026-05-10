import React from 'react';
import { View, Text, Image } from 'react-native';
import { usePerfilSorteadoHeaderViewModel, Props } from './PerfilSorteadoHeaderViewModel'
import { ReturnHomeArrow } from '../ReturnHomeArrow';
import { styles } from './styles';

export const PerfilSorteadoHeader = (props: Props) => {
    const { nome, fotoUrl, idade, genero } = usePerfilSorteadoHeaderViewModel(props);
    
    return (
        <View style={styles.headerContainer}>
            <View style={styles.returnArrow}>
                <ReturnHomeArrow />
            </View>
            <View style={styles.logoContainer}>
                <Text style={styles.shakeText}>SHAKE</Text>
                <Text style={styles.itText}>IT</Text>
            </View>
            <View style={styles.contentContainer}>
                <Image
                    testID="profile-image"
                    source={{ uri: fotoUrl }}
                    style={styles.profileImage}
                    />
                <View style={styles.infoContainer}>
                    <Text style={styles.labelSecret}>Seu amigo secreto é</Text>
                    <Text style={styles.nameText}>{nome}</Text>
                    <View style={styles.rowDetails}>
                        <Text style={styles.detailText}>Idade: {idade}</Text>
                        <Text style={[styles.detailText, { marginLeft: 20 }]}>Gênero: {genero}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}