import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { updateUsuario } from '../../services/cloud/User/UserDb';
import {
    getWishlistByOwner,
    addLikeTagToWishlist,
    removeLikeTagFromWishlist,
    addAvoidTagToWishlist,
    removeAvoidTagFromWishlist,
} from '../../services/cloud/Wishlist/WishlistDb';

export const useMeuPerfilViewModel = () => {
    const { usuarioAtual, updateUsuarioAtual } = useAuth();
    const [bio, setBio] = useState('');
    const [camisa, setCamisa] = useState('');
    const [calca, setCalca] = useState('');
    const [calcado, setCalcado] = useState('');
    const [interesses, setInteresses] = useState<string[]>([]);
    const [novoInteresse, setNovoInteresse] = useState('');
    const [gostos, setGostos] = useState<string[]>(usuarioAtual?.gostos || []);
    const [evitar, setEvitar] = useState<string[]>(usuarioAtual?.evitar || []);
    const [novoGostoState, setNovoGostoState] = useState('');
    const [novoEvitarState, setNovoEvitarState] = useState('');

    const setNovoGosto = (text: string) => {
        if (text.endsWith(' ')) {
            const trimmed = text.trim();
            if (trimmed && !gostos.includes(trimmed)) {
                setGostos((prev) => [...prev, trimmed]);
                if (usuarioAtual) {
                    addLikeTagToWishlist(usuarioAtual.id, "user", trimmed).catch(console.error);
                }
            }
            setNovoGostoState('');
        } else {
            setNovoGostoState(text);
        }
    };

    const setNovoEvitar = (text: string) => {
        if (text.endsWith(' ')) {
            const trimmed = text.trim();
            if (trimmed && !evitar.includes(trimmed)) {
                setEvitar((prev) => [...prev, trimmed]);
                if (usuarioAtual) {
                    addAvoidTagToWishlist(usuarioAtual.id, "user", trimmed).catch(console.error);
                }
            }
            setNovoEvitarState('');
        } else {
            setNovoEvitarState(text);
        }
    };
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        const loadWishlist = async () => {
            if (usuarioAtual) {
                try {
                    const wishlist = await getWishlistByOwner(usuarioAtual.id, "user");
                    if (wishlist) {
                        setGostos(wishlist.likes_tags || []);
                        setEvitar(wishlist.avoids_tags || []);
                    }
                } catch (error) {
                    console.error("Erro ao carregar wishlist:", error);
                }
            }
        };

        if (usuarioAtual) {
            setBio(usuarioAtual.bio || '');
            setCamisa(usuarioAtual.sizes?.camisa || '');
            setCalca(usuarioAtual.sizes?.calca || '');
            setCalcado(usuarioAtual.sizes?.calcado || '');
            setInteresses(usuarioAtual.interesses || []);
            setGostos(usuarioAtual.gostos || []);
            setEvitar(usuarioAtual.evitar || []);
            loadWishlist();
        }
    }, [usuarioAtual]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const handleRemoveInteresse = (interesseToRemove: string) => {
        setInteresses((prev) => prev.filter((item) => item !== interesseToRemove));
    };

    const handleAddInteresse = () => {
        const trimmed = novoInteresse.trim();
        if (trimmed && !interesses.includes(trimmed)) {
            setInteresses((prev) => [...prev, trimmed]);
            setNovoInteresse('');
        }
    };

    const handleRemoveGosto = (itemToRemove: string) => {
        setGostos((prev) => prev.filter((item) => item !== itemToRemove));
        if (usuarioAtual) {
            removeLikeTagFromWishlist(usuarioAtual.id, "user", itemToRemove).catch(console.error);
        }
    };

    const handleAddGosto = () => {
        const trimmed = novoGostoState.trim();
        if (trimmed && !gostos.includes(trimmed)) {
            setGostos((prev) => [...prev, trimmed]);
            setNovoGostoState('');
            if (usuarioAtual) {
                addLikeTagToWishlist(usuarioAtual.id, "user", trimmed).catch(console.error);
            }
        }
    };

    const handleRemoveEvitar = (itemToRemove: string) => {
        setEvitar((prev) => prev.filter((item) => item !== itemToRemove));
        if (usuarioAtual) {
            removeAvoidTagFromWishlist(usuarioAtual.id, "user", itemToRemove).catch(console.error);
        }
    };

    const handleAddEvitar = () => {
        const trimmed = novoEvitarState.trim();
        if (trimmed && !evitar.includes(trimmed)) {
            setEvitar((prev) => [...prev, trimmed]);
            setNovoEvitarState('');
            if (usuarioAtual) {
                addAvoidTagToWishlist(usuarioAtual.id, "user", trimmed).catch(console.error);
            }
        }
    };

    const handleSalvar = async () => {
        if (!usuarioAtual) return;
        setIsSaving(true);
        clearMessages();
        try {
            const updatedSizes = {
                camisa: camisa || undefined,
                calca: calca || undefined,
                calcado: calcado || undefined,
            };
            const updatedData = {
                bio: bio || undefined,
                sizes: updatedSizes,
                interesses: interesses,
            };
            await updateUsuario(usuarioAtual.id, updatedData);
            updateUsuarioAtual(updatedData);
            setSuccessMessage('Perfil atualizado com sucesso!');
            timeoutRef.current = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch {
            setErrorMessage('Erro ao atualizar o perfil. Tente novamente.');
            timeoutRef.current = setTimeout(() => {
                setErrorMessage('');
            }, 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        bio,
        setBio,
        camisa,
        setCamisa,
        calca,
        setCalca,
        calcado,
        setCalcado,
        interesses,
        novoInteresse,
        setNovoInteresse,
        handleAddInteresse,
        handleRemoveInteresse,
        gostos,
        setGostos,
        novoGosto: novoGostoState,
        setNovoGosto,
        handleAddGosto,
        handleRemoveGosto,
        evitar,
        setEvitar,
        novoEvitar: novoEvitarState,
        setNovoEvitar,
        handleAddEvitar,
        handleRemoveEvitar,
        isSaving,
        successMessage,
        errorMessage,
        handleSalvar,
        clearMessages,
        usuarioAtual,
    };
};
