import React from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { IconButton } from "../../components/IconButton";
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
                                        <Text style={styles.dependentName}>{item.name}</Text>
                                        <View style={styles.actionsRow}>
                                            <IconButton
                                                iconName="edit-2"
                                                size={18}
                                                color={theme.colors.text}
                                                onPress={() => handleEditDependent(item)}
                                                style={styles.actionButton}
                                                testID={`edit-button-${item.id}`}
                                            />
                                            <IconButton
                                                iconName="trash-2"
                                                size={18}
                                                color={theme.colors.danger}
                                                onPress={() => confirmDeleteDependent(item.id)}
                                                style={styles.actionButton}
                                                testID={`delete-button-${item.id}`}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.cardContent}>
                                        <View style={styles.detailRow}>
                                            <Feather name="calendar" size={14} color={theme.colors.textLight} />
                                            <Text style={styles.detailText}>
                                                Nascimento: {formatDate(item.birth_date)} ({getAgeText(item.birth_date)})
                                            </Text>
                                        </View>
                                        {item.gender ? (
                                            <View style={styles.detailRow}>
                                                <Feather name="user" size={14} color={theme.colors.textLight} />
                                                <Text style={styles.detailText}>Gênero: {item.gender}</Text>
                                            </View>
                                        ) : null}
                                        {item.bio ? (
                                            <View style={styles.detailRow}>
                                                <Feather name="info" size={14} color={theme.colors.textLight} />
                                                <Text style={styles.detailText} numberOfLines={2}>{item.bio}</Text>
                                            </View>
                                        ) : null}
                                        {item.gostos && item.gostos.length > 0 ? (
                                            <View style={styles.detailRow}>
                                                <Feather name="heart" size={14} color={theme.colors.success} />
                                                <Text style={styles.detailText}>Gosta de: {item.gostos.join(", ")}</Text>
                                            </View>
                                        ) : null}
                                        {item.evitar && item.evitar.length > 0 ? (
                                            <View style={styles.detailRow}>
                                                <Feather name="x-circle" size={14} color={theme.colors.danger} />
                                                <Text style={styles.detailText}>Evitar: {item.evitar.join(", ")}</Text>
                                            </View>
                                        ) : null}

                                        <View style={[styles.typeTag, tagStyles.tag]}>
                                            <Text style={[styles.typeTagText, tagStyles.text]}>
                                                {item.dependent_type === "child" ? "👶 " : "🐶 "}
                                                {getDependentTypeLabel(item.dependent_type).toUpperCase()}
                                            </Text>
                                        </View>
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
