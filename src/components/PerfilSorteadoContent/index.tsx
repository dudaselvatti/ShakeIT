import React from 'react';
import { View, Text } from 'react-native';
import{ usePerfilSorteadoContentViewModel, Props} from './PerfilSorteadoContentViewModel'
import { styles } from './styles';

export const PerfilSorteadoContent = (props: Props) => {
    const { medidas, preferencias } = usePerfilSorteadoContentViewModel(props);
    
    return (
        <View style={styles.container}>
            <View style={styles.medidasContainer}>
                <Text style={styles.heading}>Minhas Medidas</Text>
                <View style={styles.medidasList}>
                    <Text style={styles.medidasItem}>Camisa: {medidas.camisa}</Text>
                    <Text style={styles.medidasItem}>Calça: {medidas.calca}</Text>
                    <Text style={styles.medidasItem}>Calçado: {medidas.calcado}</Text>
                </View>
            </View>
            <View style={styles.preferenciasContainer}>
                <Text style={styles.heading}>Minhas Preferências</Text>
                <Text style={styles.preferenciasTitle}>Coisas que eu amo:</Text>
                <View style={styles.preferenciasList}>
                    {preferencias.coisasQueAmo.map((item, index) => (
                        <Text key={index} style={styles.preferenciasCoisasQueAmoItem}>
                            {item}
                        </Text>
                    ))}
                </View>
                <Text style={styles.preferenciasTitle}>Melhor evitar:</Text>
                <View style={styles.preferenciasList}>
                    {preferencias.melhorEvitar.map((item, index) => (
                        <Text key={index} style={styles.preferenciasMelhorEvitarItem}>
                            {item}
                        </Text>
                    ))}
                </View>
            </View>
        </View>
    );
}