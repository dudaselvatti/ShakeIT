import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePartyPreviewViewModel } from "./PartyPreviewViewModel";
import { styles } from "./styles";
import { Button } from "../../components/Button";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { Card } from "../../components/Card";
import { Tag } from "../../components/Tag";
import { PopupModal } from "../../components/PopupModal";
import { formatCurrency } from "../../utils/Formatting/formatCurrency";
import { formatDate } from "../../utils/Formatting/formatDate";
import { theme } from "../../styles/theme";

export const PartyPreviewScreen = () => {
  const { 
    party, 
    isModalVisible,
    handleBackPress, 
    handleCancelModal,
    handleConfirmModal,
    handleReady 
  } = usePartyPreviewViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        headerTitle="Preview da Party" 
        showBackButton={true} 
        onBackPress={handleBackPress} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{party.name}</Text>
        
        <Card style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Revelação</Text>
            <Text style={styles.infoValue}>{formatDate(party.eventDate)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor</Text>
            <Text style={styles.infoValue}>
              R$ {formatCurrency(party.minPrice)} a R$ {formatCurrency(party.maxPrice)}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Seu Status</Text>
            <Tag label="Perfil Pendente" color={theme.colors.warning} />
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.descriptionText}>
          Confirme seus dados e marque que está pronto para liberar o sorteio.
        </Text>
        <Button 
          title="Confirmar Entrada" 
          onPress={handleReady} 
        />
        <Button 
          title="Voltar ao Início" 
          variant="outline" 
          onPress={handleBackPress} 
          style={styles.backButton}
        />
      </View>

      <AppFooter />

      <PopupModal 
        visible={isModalVisible}
        title="Atenção!"
        message="Seu perfil ainda não foi lockado para o sorteio, mas você já ingressou na party. Deseja realmente voltar?"
        cancelText="Cancelar"
        confirmText="Voltar para Home"
        onCancel={handleCancelModal}
        onConfirm={handleConfirmModal}
      />
    </SafeAreaView>
  );
};
