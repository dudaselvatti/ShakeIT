import React from 'react';
import { render } from '@testing-library/react-native';
import { Image } from 'react-native';
import { PartyQRCode } from '../PartyQRCode';

describe('PartyQRCode', () => {
    it('deve renderizar a imagem do QR Code', () => {
        const { UNSAFE_getByType } = render(
            <PartyQRCode partyCode="#NATAL2026" />
        );

        const image = UNSAFE_getByType(Image);

        expect(image).toBeTruthy();

        expect(image.props.source).toEqual(
        require('../../assets/qrcode.png')
        );
    });
});