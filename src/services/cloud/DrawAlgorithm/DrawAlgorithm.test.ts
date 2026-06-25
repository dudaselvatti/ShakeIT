import { executeDraw, UnsolvableGraphError } from './DrawAlgorithm';
import { runTransaction } from 'firebase/firestore';

jest.mock('../../../config/firebase', () => ({
    db: {}
}));

jest.mock('../Notification/NotificationDb', () => ({
    createNotification: jest.fn(() => Promise.resolve('mock-id'))
}));

jest.mock('firebase/firestore', () => ({
    runTransaction: jest.fn(),
    doc: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    serverTimestamp: jest.fn(),
}));

describe('DrawAlgorithm Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve validar obrigatoriedade de partyId', async () => {
    await expect(executeDraw('')).rejects.toThrow('partyId é obrigatório');
  });

  it('deve realizar o sorteio com sucesso via Transaction local', async () => {
    (runTransaction as jest.Mock).mockResolvedValueOnce({
        partyName: 'Mock Party',
        userIds: ['user1']
    });

    const result = await executeDraw('party-123');

    expect(result.success).toBe(true);
    expect(result.message).toBe('Sorteio realizado com sucesso');
    expect(runTransaction).toHaveBeenCalled();
  });

  it('deve lançar UnsolvableGraphError se o grafo não for solucionável', async () => {
    (runTransaction as jest.Mock).mockRejectedValueOnce(new Error("UNSOLVABLE_GRAPH"));

    await expect(executeDraw('party-123')).rejects.toThrow(UnsolvableGraphError);
  });

  it('deve lançar erro genérico se a transaction falhar', async () => {
    (runTransaction as jest.Mock).mockRejectedValueOnce(new Error('Server Error'));

    await expect(executeDraw('party-123')).rejects.toThrow('Server Error');
  });
});

