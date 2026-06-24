import React from "react";
import { Modal, View, Text, FlatList, TouchableWithoutFeedback } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { useAppTheme } from "../../contexts/ThemeContext";
import { createStyles } from "./styles";
import { useAddDependentModalViewModel, Props } from "./AddDependentModalViewModel";

export const AddDependentModal = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const {
        dependents,
        loading,
        addingIds,
        handleAdd,
        onClose,
        visible,
        onNavigateToCreate,
    } = useAddDependentModalViewModel(props);

    const getDependentIcon = (type: string) => {
        if (type === "child") return "smile";
        if (type === "pet") return "twitter";
        return "user";
    };

    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Vincular Dependente</Text>
                                <IconButton iconName="x" size={24} color={theme.colors.textLight} onPress={onClose} />
                            </View>

                            {loading ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.empty}>Carregando seus dependentes...</Text>
                                </View>
                            ) : dependents.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Feather name="users" size={48} color={theme.colors.textLight} />
                                    <Text style={styles.empty}>Você ainda não possui dependentes cadastrados.</Text>
                                    <Button 
                                        title="Criar novo dependente" 
                                        variant="text" 
                                        onPress={() => {
                                            onClose();
                                            if (onNavigateToCreate) {
                                                onNavigateToCreate();
                                            }
                                        }}
                                    />
                                </View>
                            ) : (
                                <FlatList
                                    data={dependents}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <View style={styles.depItem}>
                                            <View style={styles.depInfo}>
                                                <Feather name={getDependentIcon(item.dependent_type) as any} size={20} color={theme.colors.primary} />
                                                <Text style={styles.depName}>{item.name}</Text>
                                            </View>
                                            {addingIds.includes(item.id) ? (
                                                <Feather name="loader" size={24} color={theme.colors.primary} />
                                            ) : (
                                                <IconButton 
                                                    iconName="plus" 
                                                    onPress={() => handleAdd(item)}
                                                    color={theme.colors.primary}
                                                    size={24}
                                                />
                                            )}
                                        </View>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
