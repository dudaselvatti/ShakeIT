import React from "react";
import { Modal, View, Text, ModalProps } from "react-native";
import { styles } from "./styles";
import { Button } from "../Button";

interface PopupModalProps extends ModalProps {
  visible: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PopupModal = ({
  visible,
  title,
  message,
  cancelText = "Cancelar",
  confirmText = "OK",
  onCancel,
  onConfirm,
  ...rest
}: PopupModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade" {...rest}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <Button
              title={cancelText}
              variant="text"
              onPress={onCancel}
              style={styles.modalButton}
            />
            <Button
              title={confirmText}
              variant="primary"
              onPress={onConfirm}
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
