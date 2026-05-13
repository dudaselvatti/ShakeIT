import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';

export function useReturnHomeArrowViewModel() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handlePress = () => {
        navigation.navigate("Home");
    };

    return {
        handlePress,
    };
};