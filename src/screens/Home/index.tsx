import React from "react";
import { View, Text, FlatList } from "react-native";
import { PartyCard } from "../../components/PartyCard";
import { IconButton } from "../../components/IconButton";
import { useHomeViewModel } from "./HomeViewModel";
import { styles } from "./styles";

export const HomeScreen = () => {
  const { parties, handleCardPress, handleCreateParty, handleScanPress, userName } = useHomeViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.headerPlaceholder}>
        <Text style={styles.greeting}>Olá, {userName} 👋</Text>
        <IconButton
          iconName="camera"
          onPress={handleScanPress}
          testID="scan-button"
        />
      </View>

      <Text style={styles.sectionTitle}>Suas Parties</Text>

      <FlatList
        data={parties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PartyCard 
            name={item.name}
            status={item.status}
            eventDate={item.eventDate}
            onPress={() => handleCardPress(item)} 
          />
        )}
      />


      <View style={styles.fabContainer}>
        <IconButton
          iconName="plus"
          variant="fab"
          onPress={handleCreateParty}
          testID="fab-button"
        />
      </View>
    </View>
  );
};
