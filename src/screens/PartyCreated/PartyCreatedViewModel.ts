import { useRoute, useNavigation } from '@react-navigation/native';
import { Party } from "../../types/Party";
import { useQuery } from '@tanstack/react-query';
import { getPartyFromCloud } from '../../services/cloud/Party/PartyDb';

export function usePartyCreatedViewModel() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const { partyId } = route.params as { partyId: string };

    const { data: party } = useQuery({
        queryKey: ['party', partyId],
        queryFn: async () => {
            const cloudParty = await getPartyFromCloud(partyId);
            if (!cloudParty) throw new Error("Festa não encontrada");
            return cloudParty;
        },
    });

    const voltarParaHome = () => {
        navigation.navigate("Home");
    };

    return{
        party,
        voltarParaHome
    };
}