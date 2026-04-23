import React, { useState } from "react";
import { View, Text } from "react-native";
import { IconButton } from "../../components/IconButton";
import { PopupModal } from "../../components/PopupModal";
import { styles } from "./styles";

export const CreatePartyScreen = ({ navigation }: any) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const handleBackPress = () => {
    setModalVisible(true);
  };
  const confirmExit = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* header falso (apenas com o botão de voltar por enquanto) */}
      <View style={styles.header}>
        <IconButton iconName="chevron-left" onPress={handleBackPress} />
      </View>

      {/* conteudo generico para teste*/}
      <View style={styles.content}>
        <Text style={styles.title}>Tela 3</Text>
        <Text style={styles.subtitle}>Criação de Party</Text>
      </View>

      <PopupModal
        visible={isModalVisible}
        title="Atenção!"
        message="Se você voltar agora, os dados da Party serão perdidos. Deseja sair?"
        cancelText="Cancelar"
        confirmText="Sair sem salvar"
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmExit}
      />
    </View>
  );
};
