import { useRoute, useNavigation } from '@react-navigation/native';
import { Party } from "../../types/Party";

export function usePartyCreatedViewModel() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const { party } = route.params as { party: Party };

    const voltarParaHome = () => {
        navigation.navigate("Home", { novaParty: party });
    };

    return{
        party,
        voltarParaHome
    };
}