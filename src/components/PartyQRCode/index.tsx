import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { usePartyQRCodeViewModel, Props } from './PartyQRCodeViewModel';
import { createStyles } from './styles';
import { useAppTheme } from "../../contexts/ThemeContext";

export const PartyQRCode = ({ partyCode, size }: Props) => {
    const { theme } = useAppTheme();
    const { qrCodeValue, size: qrSize } = usePartyQRCodeViewModel({ partyCode, size });
    const styles = createStyles(theme, qrSize);
    return (
        <View style={styles.qrWrapper}>
            <QRCode
                value={qrCodeValue}
                size={qrSize}
                color="black"
                backgroundColor="white"
            />
        </View>
    );
}