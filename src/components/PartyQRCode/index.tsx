import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { styles } from './styles';

interface Props {
    partyCode: string;
}

export const PartyQRCode = ({ partyCode }: Props) => {
    return (
        <View style={styles.qrWrapper}>
            <QRCode
                value={partyCode}
                size={150}
                color="black"
                backgroundColor="white"
            />
        </View>
    );
}