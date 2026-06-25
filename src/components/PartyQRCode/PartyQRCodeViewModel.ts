export interface Props {
    partyCode: string;
    size?: number;
}

export function usePartyQRCodeViewModel({ partyCode, size }: Props) {
    const qrCodeValue = partyCode;

    return {
        qrCodeValue,
        size: size || 150,
    };
};