import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { IconButton } from "../../components/IconButton";
import { PopupModal } from "../../components/PopupModal";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { DateInput } from "../../components/DateInput";
import { CurrencyInput } from "../../components/CurrencyInput";
import { styles } from "./styles";

export const CreatePartyScreen = ({ navigation }: any) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const [nomeParty, setNomeParty] = useState("");
  const [dataRevelacao, setDataRevelacao] = useState<Date | undefined>(undefined);
  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");

  const handleBackPress = () => setModalVisible(true);
  const confirmExit = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <IconButton iconName="chevron-left" onPress={handleBackPress} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Nova Party</Text>

        <Input
          label="Nome da Party"
          placeholder="Ex: Amigo Secreto da Firma"
          value={nomeParty}
          onChangeText={setNomeParty}
          maxLength={30}
        />

        <DateInput
          label="Data da Revelação"
          value={dataRevelacao}
          onChangeDate={(dataEscolhida) => setDataRevelacao(dataEscolhida)}
        />

        <View style={styles.row}>
          <CurrencyInput
            label="Valor Mínimo"
            placeholder="0,00"
            value={valorMinimo}
            onChangeText={setValorMinimo}
            keyboardType="numeric"
            containerStyle={{ width: "48%" }}
          />

          <CurrencyInput
            label="Valor Máximo"
            placeholder="50,00"
            value={valorMaximo}
            onChangeText={setValorMaximo}
            keyboardType="numeric"
            containerStyle={{ width: "48%" }}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Criar Party"
          onPress={() => navigation.navigate('PartyAdmin', {
            partyName: "Natal 2026", 
            partyCode: "#NATAL2026" 
          })}
          disabled={!nomeParty}
        />
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
    </KeyboardAvoidingView>
    
  );
};