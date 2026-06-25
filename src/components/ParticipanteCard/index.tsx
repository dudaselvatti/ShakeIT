import React from 'react';
import { View, Text, Image } from 'react-native';
import { createStyles } from './styles';
import { useParticipanteCardViewModel, Props } from "./ParticipanteCardViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";
import { IconButton } from '../IconButton';

export const ParticipanteCard = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { nome, statusIcon, statusText, isConfirmado, avatarSource, onRemove, showRemoveIcon } = useParticipanteCardViewModel(props);
    
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {avatarSource && <Image source={avatarSource} style={{ width: 24, height: 24, marginRight: 8, borderRadius: 12, resizeMode: 'cover' }} />}
                <Text style={styles.nome} numberOfLines={1}>{nome}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Image source={statusIcon} style={{ width: 16, height: 16, marginRight: 5 }} resizeMode="contain" />
                {!isConfirmado && (<Text style={styles.statusText}>{statusText}</Text>)}
                {showRemoveIcon && (
                    <View style={{ marginLeft: 10 }}>
                        <IconButton 
                            iconName="trash-2" 
                            onPress={onRemove!} 
                            color={theme.colors.danger} 
                            size={18}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};