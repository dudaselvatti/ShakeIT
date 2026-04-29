import React from 'react';
import { Image, View } from 'react-native';
import { styles } from './styles';

interface Props {
    partyCode: string;
}

export const PartyQRCode = ({ partyCode }: Props) => {
    return (
        <View style={styles.qrWrapper}>
            <Image source={require('../../assets/qrcode.png')} />
        </View>
    );
}