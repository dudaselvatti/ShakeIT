import React from "react";
import { View, Text, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card } from "../../components/Card";
import { IconButton } from "../../components/IconButton";
import { Tag } from "../../components/Tag";
import { MOCK_PARTIES } from "../../mocks/parties";
import { styles } from "./styles";
import { theme } from "../../styles/theme";
import { MockButton } from "../../components/MockButton";

export const HomeScreen = ({ navigation, route }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerPlaceholder}>
        <Text style={styles.greeting}>Olá, Duda 👋</Text>
      </View>

      <Text style={styles.sectionTitle}>Suas Parties</Text>

      <FlatList
        data={MOCK_PARTIES}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card onPress={() => console.log("Abrir Party", item.id)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Feather
                name={item.status === "Sorteio Realizado" ? "gift" : "clock"}
                size={20}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.cardInfoRow}>
              <Feather
                name="calendar"
                size={14}
                color={theme.colors.textLight}
              />
              <Text style={styles.cardInfoText}> Evento: {item.eventDate}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Tag
                label={item.status}
                color={
                  item.status === "Sorteio Realizado"
                    ? theme.colors.success
                    : theme.colors.primary
                }
              />

              {item.status === "Aguardando Sorteio" && (
                <Text style={styles.participantCount}>
                  {item.totalParticipants}/{item.maxParticipants} membros
                </Text>
              )}
            </View>
          </Card>
        )}
      />

      <View style={styles.fabContainer}>
        <IconButton
          iconName="plus"
          variant="fab"
          onPress={() => navigation.navigate("CreateParty")}
        />
      </View>

      <View style={styles.cardFooter}>
        {/* BOTÃO PROVISÓRIO PARA TESTAR A T08 */}
        <MockButton 
          title="[Dev] Testar Tela de Shake (T08)" 
          onPress={() => navigation.navigate("ShakeReveal")} 
        />
      </View>
    </View>
  );
};
