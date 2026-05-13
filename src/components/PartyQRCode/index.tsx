import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { usePartyQRCodeViewModel, Props } from './PartyQRCodeViewModel';
import { styles } from './styles';

export const PartyQRCode = ({ partyCode }: Props) => {
    const { qrCodeValue } = usePartyQRCodeViewModel({ partyCode });
    return (
        <View style={styles.qrWrapper}>
            <QRCode
                value={qrCodeValue}
                size={150}
                color="black"
                backgroundColor="white"
            />
        </View>
    );
}