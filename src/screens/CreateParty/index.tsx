import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { IconButton } from "../../components/IconButton";
import { PopupModal } from "../../components/PopupModal";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { DateInput } from "../../components/DateInput";
import { CurrencyInput } from "../../components/CurrencyInput";
import { gerarPartyCode } from "../../utils/PartyCode";
import { styles } from "./styles";
import { Party } from "../../@types/Party";

export const CreatePartyScreen = ({ navigation }: any) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const [nomeParty, setNomeParty] = useState("");
  const [dataRevelacao, setDataRevelacao] = useState<Date | undefined>(undefined);
  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");

  const [errors, setErrors] = useState({ nome: "", data: "", valores: "" });

  const handleBackPress = () => setModalVisible(true);
  const confirmExit = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const parseCurrency = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, "").replace(",", "."));
  };

  const handleCriarParty = () => {
    let isValid = true;
    let newErrors = { nome: "", data: "", valores: "" };

    if (!nomeParty.trim()) {
      newErrors.nome = "O nome da Party é obrigatório.";
      isValid = false;
    }

    if (!dataRevelacao) {
      newErrors.data = "Selecione a data da revelação.";
      isValid = false;
    }

    const numMin = parseCurrency(valorMinimo);
    const numMax = parseCurrency(valorMaximo);

    if (valorMinimo === "" || valorMaximo === "") {
      newErrors.valores = "Preencha o valor mínimo e máximo.";
      isValid = false;
    } else if (numMax < numMin) {
      newErrors.valores = "O valor máximo não pode ser menor que o mínimo.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      const novaParty: Party = {
        id: Math.random().toString(36).substring(2, 10),
        name: nomeParty,
        eventDate: dataRevelacao!.toISOString(),
        minPrice: numMin,
        maxPrice: numMax,
        maxParticipants: 10,
        status: "Aguardando Sorteio",
      };

      console.log("SUCESSO! Party Criada:", novaParty);

      navigation.navigate("PartyCreated", { party: novaParty });
    }
  };

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
          onChangeText={(text) => {
            setNomeParty(text);
            if (errors.nome) setErrors({ ...errors, nome: "" });
          }}
          maxLength={30}
        />
        {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

        <DateInput
          label="Data da Revelação"
          value={dataRevelacao}
          onChangeDate={(data) => {
            setDataRevelacao(data);
            if (errors.data) setErrors({ ...errors, data: "" });
          }}
        />
        {errors.data ? <Text style={styles.errorText}>{errors.data}</Text> : null}

        <View style={styles.row}>
          <CurrencyInput
            label="Valor Mínimo"
            placeholder="0,00"
            value={valorMinimo}
            onChangeText={(text) => {
              setValorMinimo(text);
              if (errors.valores) setErrors({ ...errors, valores: "" });
            }}
            containerStyle={{ width: "48%" }}
          />
          <CurrencyInput
            label="Valor Máximo"
            placeholder="50,00"
            value={valorMaximo}
            onChangeText={(text) => {
              setValorMaximo(text);
              if (errors.valores) setErrors({ ...errors, valores: "" });
            }}
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
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmExit}
      />
    </KeyboardAvoidingView>
  );
};