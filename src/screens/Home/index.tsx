import React from "react";
import { View, Text, FlatList, Switch } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { PartyCard } from "../../components/PartyCard";
import { IconButton } from "../../components/IconButton";
import { useHomeViewModel } from "./HomeViewModel";
import { createStyles } from "./styles";
import { useAppTheme } from "../../contexts/ThemeContext";

export const HomeScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const { parties, handleCardPress, handleCreateParty, userName, hideFinished, setHideFinished } = useHomeViewModel();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader headerTitle="Início" showBackButton={false} showSettingsIcon={true} />

      <View style={styles.headerPlaceholder}>
        <Text style={styles.greeting}>Olá, {userName}!</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suas Parties</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Ocultar antigas</Text>
          <Switch 
            value={hideFinished} 
            onValueChange={setHideFinished}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
      </View>

      <FlatList
        data={parties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        renderItem={({ item }) => (
          <PartyCard
            name={item.name}
            status={item.status}
            eventDate={item.event_date}
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
