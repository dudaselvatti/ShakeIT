import { usePartyQRCodeViewModel } from './PartyQRCodeViewModel';

describe('usePartyQRCodeViewModel', () => {
  it('deve retornar o partyCode corretamente como qrCodeValue', () => {
    const mockPartyCode = 'ABC-123';
    const props = { partyCode: mockPartyCode };

    const { qrCodeValue } = usePartyQRCodeViewModel(props);

    expect(qrCodeValue).toBe(mockPartyCode);
  });

  it('deve atualizar o qrCodeValue quando uma prop diferente for fornecida', () => {
    const firstCode = 'PARTY-1';
    const secondCode = 'PARTY-2';

    const result1 = usePartyQRCodeViewModel({ partyCode: firstCode });
    const result2 = usePartyQRCodeViewModel({ partyCode: secondCode });

    expect(result1.qrCodeValue).toBe(firstCode);
    expect(result2.qrCodeValue).toBe(secondCode);
  });
});