import React from 'react';
import { render } from '@testing-library/react-native';
import { PartyQRCode } from '../PartyQRCode';
import QRCode from 'react-native-qrcode-svg';

jest.mock('react-native-qrcode-svg', () => { 
  const { View } = jest.requireActual('react-native');
  const MockQRCode = (props: any) => <View testID="mock-qrcode" {...props} />;
  MockQRCode.displayName = 'MockQRCode';
  return MockQRCode;
});

describe('PartyQRCode', () => {
    it('deve garantir que o QR Code receba o partyCode corretamente', () => {
        const testCode = "#ABC123";
        const { UNSAFE_getByType } = render(
            <PartyQRCode partyCode={testCode} />
        );

        const qrCodeComponent = UNSAFE_getByType(QRCode);

        expect(qrCodeComponent.props.value).toBe(testCode);
    });

    it('deve garantir que o código seja renderizado com as cores de contraste necessárias', () => {
        const { UNSAFE_getByType } = render(
            <PartyQRCode partyCode="#ABC123" />
        );

        const qrCodeComponent = UNSAFE_getByType(QRCode);

        expect(qrCodeComponent.props.backgroundColor).toBe('white');
        expect(qrCodeComponent.props.color).toBe('black');
    });
});