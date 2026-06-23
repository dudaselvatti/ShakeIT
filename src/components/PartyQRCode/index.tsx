import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { usePartyQRCodeViewModel, Props } from './PartyQRCodeViewModel';
import { createStyles } from './styles';
import { useAppTheme } from "../../contexts/ThemeContext";

export const PartyQRCode = ({ partyCode }: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
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