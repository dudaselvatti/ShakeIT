import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { getDependentsByUser, deleteDependentFromCloud } from "../../services/cloud/Dependent/DependentDb";
import { getOrCreateWishlist } from "../../services/cloud/Wishlist/WishlistDb";
import { Dependent } from "../../types/Dependent";

export function useGestaoDependentesViewModel(navigation: any) {
    const { usuarioAtual } = useAuth();
    const [dependents, setDependents] = useState<Dependent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [dependentToDelete, setDependentToDelete] = useState<string | null>(null);

    const loadDependents = useCallback(async () => {
        if (!usuarioAtual) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await getDependentsByUser(usuarioAtual.id);
            const depsWithWishlist = await Promise.all(data.map(async (dep) => {
                const wishlist = await getOrCreateWishlist(dep.id, "dependent");
                return { 
                    ...dep, 
                    gostos: wishlist.likes_tags || [], 
                    evitar: wishlist.avoids_tags || [] 
                };
            }));
            setDependents(depsWithWishlist as Dependent[]);
        } catch (error) {
            console.error("Erro ao carregar dependentes:", error);
            setErrorMessage("Não foi possível carregar os dependentes.");
        } finally {
            setIsLoading(false);
        }
    }, [usuarioAtual]);

    useEffect(() => {
        // Recarregar os dependentes sempre que a tela focar
        const unsubscribe = navigation.addListener("focus", () => {
            loadDependents();
        });

        loadDependents();

        return unsubscribe;
    }, [navigation, loadDependents]);

    const handleAddDependent = () => {
        navigation.navigate("FormDependente");
    };

    const handleEditDependent = (dependent: Dependent) => {
        navigation.navigate("FormDependente", { dependent });
    };

    const confirmDeleteDependent = (id: string) => {
        setDependentToDelete(id);
    };

    const cancelDelete = () => {
        setDependentToDelete(null);
    };

    const executeDelete = async () => {
        if (!dependentToDelete) return;
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            await deleteDependentFromCloud(dependentToDelete);
            setSuccessMessage("Dependente excluído com sucesso!");
            setDependentToDelete(null);
            await loadDependents();
        } catch (error) {
            console.error("Erro ao deletar dependente:", error);
            setErrorMessage("Não foi possível excluir o dependente.");
        } finally {
            setIsLoading(false);
        }
    };

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    return {
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
        loadDependents,
    };
}
