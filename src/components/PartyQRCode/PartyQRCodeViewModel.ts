export interface Props {
    partyCode: string;
}

export function usePartyQRCodeViewModel({ partyCode }: Props) {
    const qrCodeValue = partyCode;

    return {
        qrCodeValue,
    };
};