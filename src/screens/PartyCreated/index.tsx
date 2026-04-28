import React from "react";
import { View, Text } from "react-native";
import { theme } from "../../styles/theme";

export const PartyCreatedScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.colors.primary }}>
        Party Criada com Sucesso!
      </Text>
      <Text style={{ color: theme.colors.textLight, marginTop: 8 }}>
        (Tela 3.1 Provisória)
      </Text>
    </View>
  );
};