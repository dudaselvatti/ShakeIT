import React from "react";
import { View, Text } from "react-native";
import { theme } from "../../styles/theme";
import { Button } from "../../components/Button";

export const PartyCreatedScreen = ({ route, navigation }: any) => {
  const { party } = route.params;

  const voltarParaHome = () => {
    navigation.navigate("Home", { novaParty: party });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background, padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: theme.colors.success, marginBottom: 16 }}>
        Party Criada!
      </Text>
      
      <View style={{ backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, width: '100%', marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>ID: {party.id}</Text>
        <Text style={{ fontSize: 16, marginTop: 8 }}>Nome: {party.name}</Text>
        <Text style={{ fontSize: 16, marginTop: 8 }}>Status: {party.status}</Text>
        <Text style={{ fontSize: 16, marginTop: 8 }}>
          Valores: R$ {party.minPrice} - R$ {party.maxPrice}
        </Text>
      </View>

      <Button title="Ir para a Home" onPress={voltarParaHome} style={{ width: '100%' }} />
    </View>
  );
};