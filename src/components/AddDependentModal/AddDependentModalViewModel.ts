import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { getDependentsByUser } from "../../services/cloud/Dependent/DependentDb";
import { createDependentPartyParticipant } from "../../services/cloud/PartyParticipant/PartyParticipantDb";
import { getOrCreateWishlist } from "../../services/cloud/Wishlist/WishlistDb";
import { Dependent } from "../../types/Dependent";

export interface Props {
    visible: boolean;
    partyId: string;
    onClose: () => void;
    onDependentAdded: () => void;
    onNavigateToCreate?: () => void;
}

export function useAddDependentModalViewModel({ visible, partyId, onClose, onDependentAdded, onNavigateToCreate }: Props) {
    const { usuarioAtual } = useAuth();
    const [dependents, setDependents] = useState<Dependent[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingIds, setAddingIds] = useState<string[]>([]);

    useEffect(() => {
        if (visible && usuarioAtual) {
            setLoading(true);
            getDependentsByUser(usuarioAtual.id).then((deps) => {
                setDependents(deps);
            }).finally(() => setLoading(false));
        }
    }, [visible, usuarioAtual]);

    const handleAdd = async (dependent: Dependent) => {
        if (!usuarioAtual) return;
        try {
            setAddingIds(prev => [...prev, dependent.id]);
            const wishlist = await getOrCreateWishlist(dependent.id, "dependent");
            await createDependentPartyParticipant(partyId, usuarioAtual, dependent, wishlist.likes_tags || [], wishlist.avoids_tags || []);
            onDependentAdded();
        } catch (error) {
            console.error("Error adding dependent to party", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
        } finally {
            setAddingIds(prev => prev.filter(id => id !== dependent.id));
        }
    };

    return {
        dependents,
        loading,
        addingIds,
        handleAdd,
        onClose,
        visible,
        onNavigateToCreate,
    };
}
