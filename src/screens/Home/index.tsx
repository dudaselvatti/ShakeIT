import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { PartyCard } from "../../components/PartyCard";
import { IconButton } from "../../components/IconButton";
import { useHomeViewModel } from "./HomeViewModel";
import { styles } from "./styles";

export const HomeScreen = () => {
  const { parties, handleCardPress, handleCreateParty, handleScanPress, userName } = useHomeViewModel();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader headerTitle="Início" showBackButton={false} showSettingsIcon={true} />

      <View style={styles.headerPlaceholder}>
        <Text style={styles.greeting}>Olá, {userName} 👋</Text>
      </View>

      <Text style={styles.sectionTitle}>Suas Parties</Text>

      <FlatList
        data={parties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        renderItem={({ item }) => (
          <PartyCard 
            name={item.name}
            status={item.status}
            eventDate={item.eventDate}
            onPress={() => handleCardPress(item)} 
          />
        )}
      />


      <View style={[styles.fabContainer, { bottom: insets.bottom + 90 }]}>
        <IconButton
          iconName="plus"
          variant="fab"
          onPress={handleCreateParty}
          testID="fab-button"
        />
      </View>

      <AppFooter />
    </SafeAreaView>
  );
};
