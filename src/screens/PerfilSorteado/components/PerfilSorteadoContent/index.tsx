import React from 'react';
import { View, Text } from 'react-native';
import{ usePerfilSorteadoContentViewModel, Props} from './PerfilSorteadoContentViewModel'
import { createStyles } from './styles';
import { useAppTheme } from "../../../../contexts/ThemeContext";

export const PerfilSorteadoContent = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { medidas, preferencias } = usePerfilSorteadoContentViewModel(props);

    return (
        <View style={styles.container}>
            {medidas && (
                <View style={styles.medidasContainer}>
                    <Text style={styles.heading}>Minhas Medidas</Text>
                    <View style={styles.medidasList}>
                        {medidas.camisa && <Text style={styles.medidasItem}>Camisa: {medidas.camisa}</Text>}
                        {medidas.calca && <Text style={styles.medidasItem}>Calça: {medidas.calca}</Text>}
                        {medidas.calcado && <Text style={styles.medidasItem}>Calçado: {medidas.calcado}</Text>}
                    </View>
                </View>
            )}
            {preferencias && (
                <View style={styles.preferenciasContainer}>
                    <Text style={styles.heading}>Minhas Preferências</Text>
                    {preferencias.coisasQueAmo && preferencias.coisasQueAmo.length > 0 && (
                        <>
                            <Text style={styles.preferenciasTitle}>Coisas que eu amo:</Text>
                            <View style={styles.preferenciasList}>
                                {preferencias.coisasQueAmo.map((item, index) => (
                                    <Text key={index} style={styles.preferenciasCoisasQueAmoItem}>
                                        {item}
                                    </Text>
                                ))}
                            </View>
                        </>
                    )}
                    {preferencias.melhorEvitar && preferencias.melhorEvitar.length > 0 && (
                        <>
                            <Text style={styles.preferenciasTitle}>Melhor evitar:</Text>
                            <View style={styles.preferenciasList}>
                                {preferencias.melhorEvitar.map((item, index) => (
                                    <Text key={index} style={styles.preferenciasMelhorEvitarItem}>
                                        {item}
                                    </Text>
                                ))}
                            </View>
                        </>
                    )}
                </View>
            )}
        </View>
    );
}