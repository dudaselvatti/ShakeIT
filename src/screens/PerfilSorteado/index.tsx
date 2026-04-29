import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { PerfilSorteadoHeader } from '../../components/PerfilSorteadoHeader';
import { PerfilSorteadoContent } from '../../components/PerfilSorteadoContent';
import { usePerfilSorteadoViewModel } from './PerfilSorteadoViewModel';
import { styles } from './styles';

export const PerfilSorteadoScreen = () => {
    const { participante } = usePerfilSorteadoViewModel();
    const { usuario, perfil } = participante;
    return (
        <View style={styles.container}>
            <PerfilSorteadoHeader 
                fotoUrl={usuario.fotoUrl} 
                nome={usuario.nome} 
                dataDeNascimento={usuario.dataDeNascimento} 
                genero={usuario.genero}
            />
            <ScrollView>
                <PerfilSorteadoContent 
                    medidas={perfil.medidas} 
                    preferencias={perfil.preferencias}
                />
            </ScrollView>
        </View>
    );
}