import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Medidas, Preferencias } from '../../@types/Perfil'
import { PerfilSorteadoHeader } from '../../components/PerfilSorteadoHeader';
import { PerfilSorteadoContent } from '../../components/PerfilSorteadoContent';
import { styles } from './styles';

interface Props {
    fotoUrl: string;
    nome: string;
    dataDeNascimento: string;
    genero: string;
    medidas: Medidas;
    preferencias: Preferencias;
}

export const PerfilSorteado = ({ fotoUrl, nome, dataDeNascimento, genero, medidas, preferencias }: Props) => {
    return (
        <View style={styles.container}>
            <PerfilSorteadoHeader fotoUrl={fotoUrl} nome={nome} dataDeNascimento={dataDeNascimento} genero={genero}/>
            <ScrollView>
                <PerfilSorteadoContent medidas={medidas} preferencias={preferencias}/>
            </ScrollView>
        </View>
    );
}