import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';

export interface Props {
    headerTitle: string;
    showBackButton?: boolean;
    showSettingsIcon?: boolean;
    onBackPress?: () => void;
}

export function useAppHeaderViewModel({ headerTitle, showBackButton = true, showSettingsIcon = false, onBackPress }: Props) {
    const title = useMemo(() => headerTitle, [headerTitle]);
    const navigation = useNavigation<any>();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
            return;
        }

        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate("Home");
        }
    };

    const handleSettingsPress = () => {
        navigation.navigate("Settings");
    };

    return {
        title,
        showBackButton,
        showSettingsIcon,
        handleBackPress,
        handleSettingsPress,
    };
};