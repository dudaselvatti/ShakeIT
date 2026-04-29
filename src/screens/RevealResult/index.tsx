import React from "react";
import { View, Text } from "react-native";
import { Button } from "../../components/Button";
import { theme } from "../../styles/theme";

export const RevealResultScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16, color: theme.colors.text }}>
        Tela 7 (Provisória)
      </Text>
      <Text style={{ textAlign: "center", marginBottom: 24, color: theme.colors.text }}>
        Aqui aparecerá o nome do seu Amigo Secreto sorteado!
      </Text>
      <Button 
        title="Voltar para Home" 
        onPress={() => navigation.navigate("Home")} 
      />
    </View>
  );
};