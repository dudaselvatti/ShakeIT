import { useNavigation } from "@react-navigation/native";

export function useWelcomeViewModel() {
    const navigation = useNavigation<any>();

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleRegister = () => {
        navigation.navigate('Registration');
    };

    return {
        handleLogin,
        handleRegister,
    };
}
