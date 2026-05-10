import { TouchableOpacityProps } from 'react-native';

export interface Props extends TouchableOpacityProps {
    title: string;
}

export function useMockButtonViewModel({ title, ...touchableOpacityProps }: Props) {
    return {
        title,
        ...touchableOpacityProps
    };
}