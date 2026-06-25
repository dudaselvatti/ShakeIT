import React from "react";
import { Modal, View, Text } from "react-native";
import { usePopupModalViewModel, Props } from "./PopupModalViewModel";
import { createStyles } from "./styles";
import { Button } from "../Button";
import { PixelIcon } from "../PixelIcon";
import { useAppTheme } from "../../contexts/ThemeContext";

export const PopupModal = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const { 
    visible,
    title,
    iconName,
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            {iconName && <PixelIcon name={iconName} size={28} style={{ marginRight: 8 }} />}
            <Text style={[styles.title, { marginBottom: 0 }]}>{title}</Text>
          </View>
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
