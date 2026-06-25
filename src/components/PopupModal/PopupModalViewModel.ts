import { ModalProps } from "react-native";

export interface Props extends ModalProps {
    visible: boolean;
    title: string;
    iconName?: string;
    message: string;
    cancelText?: string;
    confirmText?: string;
    onCancel: () => void;
    onConfirm: () => void;
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
        ...modalProps
    };
}