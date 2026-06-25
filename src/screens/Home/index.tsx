import React from "react";
import { View, Text, FlatList, Switch } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { PartyCard } from "../../components/PartyCard";
import { IconButton } from "../../components/IconButton";
import { SelectInput } from "../../components/SelectInput";
import { PopupModal } from "../../components/PopupModal";
import { useHomeViewModel } from "./HomeViewModel";
import { createStyles } from "./styles";
import { useAppTheme } from "../../contexts/ThemeContext";

export const HomeScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const { parties, handleCardPress, handleCreateParty, userName, hideFinished, setHideFinished, filterType, setFilterType, isDeleteModalVisible, setDeleteModalVisible, confirmDeleteParty, handleDeletePress } = useHomeViewModel();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader headerTitle="Início" showBackButton={false} showSettingsIcon={true} />

      <View style={styles.headerPlaceholder}>
        <Text style={styles.greeting}>Olá, {userName}!</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suas Parties</Text>
      </View>

      <View style={{ paddingHorizontal: 24, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <SelectInput 
              label="" 
              selectedValue={filterType} 
              onValueChange={setFilterType as any} 
              options={[
                { key: "todos", label: "Todos os eventos", value: "todos" },
                { key: "meus", label: "Eventos que sou dono", value: "meus" },
                { key: "outros", label: "Eventos que participo", value: "outros" }
              ]} 
              containerStyle={{ marginBottom: 0 }}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Ocultar{"\n"}antigas</Text>
          <Switch 
            value={hideFinished} 
            onValueChange={setHideFinished}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
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
            adminName={item.adminName}
            status={item.status}
            eventDate={item.event_date}
            onPress={() => handleCardPress(item)}
            showDelete={item.adminName === "Você"}
            onDeletePress={() => handleDeletePress(item)}
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

      <PopupModal
        visible={isDeleteModalVisible}
        title="Apagar Evento"
        message="Tem certeza que deseja apagar este evento? Todos os participantes serão removidos. Esta ação não pode ser desfeita."
        cancelText="Cancelar"
        confirmText="Apagar"
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={confirmDeleteParty}
      />
    </SafeAreaView>
  );
};
