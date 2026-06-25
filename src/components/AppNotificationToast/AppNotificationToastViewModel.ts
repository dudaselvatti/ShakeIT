export interface Props {
    title: string;
    message: string;
    onPress?: () => void;
    onClose?: () => void;
}

export function useAppNotificationToastViewModel(props: Props) {
    const handlePress = () => {
        if (props.onPress) {
            props.onPress();
        }
    };

    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    };

    return {
        title: props.title,
        message: props.message,
        handlePress,
        handleClose
    };
}
