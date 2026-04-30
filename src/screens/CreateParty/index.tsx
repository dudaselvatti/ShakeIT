import React from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { IconButton } from "../../components/IconButton";
import { PopupModal } from "../../components/PopupModal";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { DateInput } from "../../components/DateInput";
import { CurrencyInput } from "../../components/CurrencyInput";
import { styles } from "./styles";

import { useCreatePartyViewModel } from "./CreatePartyViewModel";

export const CreatePartyScreen = ({ navigation }: any) => {
  const {
    nomeParty,
    updateNomeParty,
    dataRevelacao,
    updateDataRevelacao,
    valorMinimo,
    updateValorMinimo,
    valorMaximo,
    updateValorMaximo,
    errors,
    isModalVisible,
    cancelExit,
    handleBackPress,
    confirmExit,
    handleCriarParty,
  } = useCreatePartyViewModel(navigation);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}>
        <IconButton iconName="chevron-left" onPress={handleBackPress} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Nova Party</Text>

        <Input
          label="Nome da Party"
          placeholder="Ex: Amigo Secreto da Firma"
          value={nomeParty}
          onChangeText={updateNomeParty}
          maxLength={30}
        />
        {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

        <DateInput
          label="Data da Revelação"
          value={dataRevelacao}
          onChangeDate={updateDataRevelacao}
        />
        {errors.data ? <Text style={styles.errorText}>{errors.data}</Text> : null}

        <View style={styles.row}>
          <CurrencyInput
            label="Valor Mínimo"
            placeholder="0,00"
            value={valorMinimo}
            onChangeText={updateValorMinimo}
            containerStyle={{ width: "48%" }}
          />
          <CurrencyInput
            label="Valor Máximo"
            placeholder="50,00"
            value={valorMaximo}
            onChangeText={updateValorMaximo}
            containerStyle={{ width: "48%" }}
          />
        </View>
        {errors.valores ? <Text style={styles.errorText}>{errors.valores}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Criar Party"
          onPress={handleCriarParty}
          disabled={!nomeParty} 
        />
      </View>

      <PopupModal
        visible={isModalVisible}
        title="Atenção!"
        message="Se você voltar agora, os dados da Party serão perdidos. Deseja sair?"
        cancelText="Cancelar"
        confirmText="Sair sem salvar"
        onCancel={cancelExit}
        onConfirm={confirmExit}
      />
    </KeyboardAvoidingView>
  );
};