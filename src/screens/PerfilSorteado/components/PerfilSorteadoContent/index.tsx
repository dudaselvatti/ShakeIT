import React from 'react';
import { View, Text, Image } from 'react-native';
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
                        {medidas.camisa && (
                            <View style={styles.medidaCard}>
                                <Image source={require('../../../../../assets/camisa.png')} style={{ width: 48, height: 48, resizeMode: 'contain' }} />
                                <Text style={styles.medidaLabel}>Camisa</Text>
                                <Text style={styles.medidaValue}>{medidas.camisa}</Text>
                            </View>
                        )}
                        {medidas.calca && (
                            <View style={styles.medidaCard}>
                                <Image source={require('../../../../../assets/calca.png')} style={{ width: 48, height: 48, resizeMode: 'contain' }} />
                                <Text style={styles.medidaLabel}>Calça</Text>
                                <Text style={styles.medidaValue}>{medidas.calca}</Text>
                            </View>
                        )}
                        {medidas.calcado && (
                            <View style={styles.medidaCard}>
                                <Image source={require('../../../../../assets/tenis.png')} style={{ width: 48, height: 48, resizeMode: 'contain' }} />
                                <Text style={styles.medidaLabel}>Calçado</Text>
                                <Text style={styles.medidaValue}>{medidas.calcado}</Text>
                            </View>
                        )}
                    </View>
                </View>
            )}
            {preferencias && (
                <View style={styles.preferenciasContainer}>
                    <Text style={styles.heading}>Minhas Preferências</Text>
                    {preferencias.coisasQueAmo && preferencias.coisasQueAmo.length > 0 && (
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Image source={require('../../../../../assets/coracao.png')} style={{ width: 24, height: 24, marginRight: 8, resizeMode: 'contain' }} />
                                <Text style={styles.preferenciasTitle}>Coisas que eu amo:</Text>
                            </View>
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Image source={require('../../../../../assets/coracao-partido.png')} style={{ width: 24, height: 24, marginRight: 8, resizeMode: 'contain' }} />
                                <Text style={styles.preferenciasTitle}>Melhor evitar:</Text>
                            </View>
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