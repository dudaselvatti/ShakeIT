import React from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PixelIcon as Feather } from "../../components/PixelIcon";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { TouchableOpacity } from "react-native";
import { PopupModal } from "../../components/PopupModal";
import { createStyles } from "./styles";
import { theme } from "../../styles/theme";
import { useGestaoDependentesViewModel } from "./GestaoDependentesViewModel";
import { formatDate } from "../../utils/Formatting/formatDate";
import { calcularIdade } from "../../utils/Usuario/calcularIdade";
import { useAppTheme } from "../../contexts/ThemeContext";

export const GestaoDependentesScreen = ({ navigation }: any) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const {
        dependents,
        isLoading,
        errorMessage,
        successMessage,
        dependentToDelete,
        handleAddDependent,
        handleEditDependent,
        confirmDeleteDependent,
        cancelDelete,
        executeDelete,
        clearMessages,
    } = useGestaoDependentesViewModel(navigation);

    const getAgeText = (birthDate: string) => {
        try {
            const age = calcularIdade(birthDate);
            return `${age} ${age === 1 ? "ano" : "anos"}`;
        } catch {
            return "Idade desconhecida";
        }
    };

    const getDependentTypeLabel = (type: string) => {
        switch (type) {
            case "child": return "Filho(a)";
            case "pet": return "Pet";
            default: return "Outro";
        }
    };

    const getDependentTypeStyles = (type: string) => {
        switch (type) {
            case "child":
                return { tag: styles.typeTagChild, text: styles.typeTagTextChild };
            case "pet":
                return { tag: styles.typeTagPet, text: styles.typeTagTextPet };
            default:
                return { tag: styles.typeTagOther, text: styles.typeTagTextOther };
        }
    };

    const handleDismiss = () => {
        clearMessages();
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle="Gerenciar Dependentes" showBackButton={true} showSettingsIcon={true} />

            {isLoading && dependents.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {errorMessage ? (
                        <Pressable onPress={handleDismiss} testID="error-toast">
                            <View style={styles.errorBanner}>
                                <Feather name="alert-triangle" size={16} color={theme.colors.danger} style={{ marginRight: 8 }} />
                                <Text style={styles.errorBannerText} testID="error-message">{errorMessage}</Text>
                            </View>
                        </Pressable>
                    ) : null}

                    {successMessage ? (
                        <Pressable onPress={handleDismiss} testID="success-toast">
                            <View style={styles.successBanner}>
                                <Feather name="check-circle" size={16} color={theme.colors.success} style={{ marginRight: 8 }} />
                                <Text style={styles.successBannerText} testID="success-message">{successMessage}</Text>
                            </View>
                        </Pressable>
                    ) : null}

                    {dependents.length === 0 ? (
                        <View style={styles.emptyContainer} testID="empty-state">
                            <Feather name="users" size={48} color={theme.colors.textLight} />
                            <Text style={styles.emptyText}>
                                Você ainda não possui dependentes cadastrados.{"\n"}
                                Adicione filhos ou pets para participarem do sorteio.
                            </Text>
                        </View>
                    ) : (
                        dependents.map((item) => {
                            const tagStyles = getDependentTypeStyles(item.dependent_type);
                            return (
                                <Card key={item.id} style={styles.card} testID={`dependent-card-${item.id}`}>
                                    <View style={styles.cardHeader}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <Image 
                                                source={item.dependent_type === "child" ? require('../../../assets/crianca.png') : item.dependent_type === "pet" ? require('../../../assets/pet.png') : require('../../../assets/interrogacao.png')} 
                                                style={{ width: 40, height: 40, marginRight: 12, resizeMode: 'contain' }} 
                                            />
                                            <Text style={styles.dependentName}>{item.name}</Text>
                                        </View>
                                        <View style={[styles.actionsRow, { alignItems: 'center' }]}>
                                            <TouchableOpacity 
                                                onPress={() => handleEditDependent(item)}
                                                style={{ padding: 8 }}
                                                testID={`edit-button-${item.id}`}
                                            >
                                                <Image source={require('../../../assets/lapis.png')} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress={() => confirmDeleteDependent(item.id)}
                                                style={{ padding: 8 }}
                                                testID={`delete-button-${item.id}`}
                                            >
                                                <Image source={require('../../../assets/lixeira.png')} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.cardContent}>
                                        <View style={styles.detailRow}>
                                            <Image source={require('../../../assets/calendario.png')} style={{ width: 20, height: 20, marginRight: 8, resizeMode: 'contain' }} />
                                            <Text style={styles.detailText}>
                                                Nascimento: {formatDate(item.birth_date)} ({getAgeText(item.birth_date)})
                                            </Text>
                                        </View>
                                        {item.gender ? (
                                            <View style={styles.detailRow}>
                                                <Image source={require('../../../assets/interrogacao.png')} style={{ width: 20, height: 20, marginRight: 8, resizeMode: 'contain' }} />
                                                <Text style={styles.detailText}>Gênero: {item.gender}</Text>
                                            </View>
                                        ) : null}
                                        {item.bio ? (
                                            <View style={styles.detailRow}>
                                                <Image source={require('../../../assets/interrogacao.png')} style={{ width: 20, height: 20, marginRight: 8, resizeMode: 'contain' }} />
                                                <Text style={styles.detailText} numberOfLines={2}>{item.bio}</Text>
                                            </View>
                                        ) : null}
                                        {item.gostos && item.gostos.length > 0 ? (
                                            <View style={styles.detailRow}>
                                                <Image source={require('../../../assets/coracao.png')} style={{ width: 20, height: 20, marginRight: 8 }} />
                                                <Text style={styles.detailText}>Gosta de: {item.gostos.join(", ")}</Text>
                                            </View>
                                        ) : null}
                                        {item.evitar && item.evitar.length > 0 ? (
                                            <View style={styles.detailRow}>
                                                <Image source={require('../../../assets/coracao-partido.png')} style={{ width: 20, height: 20, marginRight: 8 }} />
                                                <Text style={styles.detailText}>Evitar: {item.evitar.join(", ")}</Text>
                                            </View>
                                        ) : null}

                                    </View>
                                </Card>
                            );
                        })
                    )}
                </ScrollView>
            )}

            <View style={styles.footer}>
                <Button title="Adicionar Dependente" onPress={handleAddDependent} testID="btn-adicionar-dependente" />
            </View>

            <AppFooter />

            <PopupModal
                visible={!!dependentToDelete}
                title="Confirmar Exclusão"
                message="Tem certeza de que deseja excluir este dependente? Esta ação não pode ser desfeita."
                cancelText="Cancelar"
                confirmText="Excluir"
                onCancel={cancelDelete}
                onConfirm={executeDelete}
                testID="delete-confirmation-modal"
            />
        </SafeAreaView>
    );
};
