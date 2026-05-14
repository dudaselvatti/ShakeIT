import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import { Button } from "../../components/Button";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { Card } from "../../components/Card";
import { styles } from "./styles";
import { usePartyCreatedViewModel } from "./PartyCreatedViewModel";

export const PartyCreatedScreen = () => {
  const { party, voltarParaHome } = usePartyCreatedViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader headerTitle="Sucesso" showBackButton={false} showSettingsIcon={true} />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          Party Criada!
        </Text>
        
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>ID: {party.id}</Text>
          <Text style={styles.cardText}>Nome: {party.name}</Text>
          <Text style={styles.cardText}>Status: {party.status}</Text>
          <Text style={styles.cardText}>
            Valores: R$ {party.minPrice} - R$ {party.maxPrice}
          </Text>
        </Card>

        <Button title="Ir para a Home" onPress={voltarParaHome} style={styles.button} />
      </View>

      <AppFooter />
    </SafeAreaView>
  );
};