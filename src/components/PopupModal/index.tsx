import React from "react";
import { Modal, View, Text } from "react-native";
import { usePopupModalViewModel, Props } from "./PopupModalViewModel";
import { styles } from "./styles";
import { Button } from "../Button";

export const PopupModal = (props: Props) => {
  const { 
    visible,
    title,
    message,
    cancelText,
    confirmText,
    onCancel,
    onConfirm,
    ...modalProps 
  } = usePopupModalViewModel(props)

  return (
    <Modal transparent visible={visible} animationType="fade" {...modalProps}>
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
