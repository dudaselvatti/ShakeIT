import { ModalProps } from "react-native";

export interface Props extends ModalProps {
    visible: boolean;
    title: string;
    iconName?: string;
    imageSource?: any;
    message: string;
    cancelText?: string;
    confirmText?: string;
    onCancel: () => void;
    onConfirm: () => void;
    hideCancelButton?: boolean;
}

export function usePopupModalViewModel({
    visible,
    title,
    iconName,
    message,
    cancelText = "Cancelar",
    confirmText = "OK",
    onCancel,
    onConfirm,
    hideCancelButton = false,
    ...modalProps
}: Props) {

    return {
        visible,
        title,
        iconName,
        message,
        cancelText,
        confirmText,
        onCancel,
        onConfirm,
        hideCancelButton,
        ...modalProps
    };
}