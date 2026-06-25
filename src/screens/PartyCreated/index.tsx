import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { Card } from "../../components/Card";
import { createStyles } from "./styles";
import { usePartyCreatedViewModel } from "./PartyCreatedViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";
import { formatDate } from "../../utils/Formatting/formatDate";
import { formatCurrency } from "../../utils/Formatting/formatCurrency";

export const PartyCreatedScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const { party, voltarParaHome } = usePartyCreatedViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader headerTitle="Sucesso" showBackButton={false} showSettingsIcon={true} />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          Party Criada!
        </Text>
        
        {party ? (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>{party.name}</Text>
            <Text style={styles.cardText}>
              Data: {formatDate(party.event_date)}
            </Text>
            <Text style={styles.cardText}>
              Valores: R$ {formatCurrency(party.min_value)} - R$ {formatCurrency(party.max_value)}
            </Text>
          </Card>
        ) : (
          <Text style={styles.cardText}>Carregando informações da party...</Text>
        )}

        <Button title="Ir para a Home" onPress={voltarParaHome} style={styles.button} />
      </View>

      <AppFooter />
    </SafeAreaView>
  );
};