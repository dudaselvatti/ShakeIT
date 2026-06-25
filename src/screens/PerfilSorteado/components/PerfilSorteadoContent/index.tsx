import React from 'react';
import { View, Text, Image } from 'react-native';
import{ usePerfilSorteadoContentViewModel, Props} from './PerfilSorteadoContentViewModel'
import { createStyles } from './styles';
import { useAppTheme } from "../../../../contexts/ThemeContext";

export const PerfilSorteadoContent = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { bio, medidas, preferencias } = usePerfilSorteadoContentViewModel(props);

    const hasMedidas = medidas && (medidas.camisa || medidas.calca || medidas.calcado);
    const hasPreferencias = preferencias && (
        (preferencias.coisasQueAmo && preferencias.coisasQueAmo.length > 0) || 
        (preferencias.melhorEvitar && preferencias.melhorEvitar.length > 0)
    );

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Image source={require('../../../../../assets/info.png')} style={{ width: 24, height: 24, marginRight: 8, resizeMode: 'contain', tintColor: theme.colors.primary }} />
                    <Text style={[styles.heading, { marginBottom: 0 }]}>Sobre mim</Text>
                </View>
                {bio ? (
                    <Text style={{ color: theme.colors.textLight, fontSize: 16, lineHeight: 24 }}>{bio}</Text>
                ) : (
                    <Text style={{ color: theme.colors.textLight, fontSize: 14, fontStyle: 'italic' }}>(sobre mim não informado antes do sorteio)</Text>
                )}
            </View>
            <View style={styles.medidasContainer}>
                <Text style={styles.heading}>Medidas</Text>
                {hasMedidas ? (
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
                ) : (
                    <Text style={{ color: theme.colors.textLight, fontSize: 14, fontStyle: 'italic', marginTop: 8 }}>(medidas não informadas antes do sorteio)</Text>
                )}
            </View>
            
            <View style={styles.preferenciasContainer}>
                <Text style={styles.heading}>Preferências</Text>
                {hasPreferencias ? (
                    <View>
                        {preferencias.coisasQueAmo && preferencias.coisasQueAmo.length > 0 && (
                            <View style={{ marginBottom: 16 }}>
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
                            </View>
                        )}
                        {preferencias.melhorEvitar && preferencias.melhorEvitar.length > 0 && (
                            <View>
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
                            </View>
                        )}
                    </View>
                ) : (
                    <Text style={{ color: theme.colors.textLight, fontSize: 14, fontStyle: 'italic', marginTop: 8 }}>(preferências não informadas antes do sorteio)</Text>
                )}
            </View>
        </View>
    );
}