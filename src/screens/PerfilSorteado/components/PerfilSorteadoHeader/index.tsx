import React from 'react';
import { View, Text, Image } from 'react-native';
import { usePerfilSorteadoHeaderViewModel, Props } from './PerfilSorteadoHeaderViewModel'
import { createStyles } from './styles';
import { useAppTheme } from "../../../../contexts/ThemeContext";

export const PerfilSorteadoHeader = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { nome, fotoUrl, idade, genero, participantType, dependentType } = usePerfilSorteadoHeaderViewModel(props);
    
    let defaultImage = require('../../../../../assets/perfil-padrao.png');
    if (participantType === 'dependent') {
        if (dependentType === 'child') defaultImage = require('../../../../../assets/crianca.png');
        if (dependentType === 'pet') defaultImage = require('../../../../../assets/pet.png');
    }

    return (
        <View style={styles.headerContainer}>
            <View style={styles.contentContainer}>
                <Image
                    testID="profile-image"
                    source={fotoUrl && !fotoUrl.includes('gravatar') ? { uri: fotoUrl } : defaultImage}
                    style={styles.profileImage}
                    />
                <View style={styles.infoContainer}>
                    <Text style={styles.labelSecret}>Seu amigo secreto é</Text>
                    <Text style={styles.nameText}>{nome}</Text>
                    <View style={styles.rowDetails}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../../../../assets/calendario.png')} style={{ width: 16, height: 16, marginRight: 4, tintColor: theme.colors.textLight }} />
                            <Text style={styles.detailText}>Idade: {idade}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
                            <Image source={require('../../../../../assets/genero.png')} style={{ width: 16, height: 16, marginRight: 4, tintColor: theme.colors.textLight }} />
                            <Text style={styles.detailText}>Gênero: {genero}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}