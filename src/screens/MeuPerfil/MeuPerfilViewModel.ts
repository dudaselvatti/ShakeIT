import { Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { updateUsuario } from '../../services/cloud/User/UserDb';
import { getOrCreateWishlist, addLikeTags, removeLikeTags, addAvoidTags, removeAvoidTags } from '../../services/cloud/Wishlist/WishlistDb';

export const useMeuPerfilViewModel = () => {
    const { usuarioAtual, updateUsuarioAtual } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [nome, setNome] = useState('');
    const [genero, setGenero] = useState('');
    const [dataNascimento, setDataNascimento] = useState<Date | undefined>(undefined);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [bio, setBio] = useState('');
    const [camisa, setCamisa] = useState('');
    const [calca, setCalca] = useState('');
    const [calcado, setCalcado] = useState('');
    const [interesses, setInteresses] = useState<string[]>([]);
    const [novoInteresse, setNovoInteresse] = useState('');
    const [gostos, setGostos] = useState<string[]>([]);
    const [evitar, setEvitar] = useState<string[]>([]);
    const [novoGostoState, setNovoGostoState] = useState('');
    const [novoEvitarState, setNovoEvitarState] = useState('');
    const [originalGostos, setOriginalGostos] = useState<string[]>([]);
    const [originalEvitar, setOriginalEvitar] = useState<string[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    const generoOptions = ["Masculino", "Feminino", "Outro"].map((size) => ({
        key: size,
        label: size,
        value: size,
    }));

    const setNovoGosto = (text: string) => {
        if (text.endsWith(' ')) {
            const trimmed = text.trim();
            if (trimmed && !gostos.includes(trimmed)) {
                setGostos((prev) => [...prev, trimmed]);
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
        if (usuarioAtual) {
            setNome(usuarioAtual.nome || '');
            setGenero(usuarioAtual.genero || '');
            let parsedDate: Date | undefined = undefined;
            if (usuarioAtual.birth_date) {
                if (typeof usuarioAtual.birth_date === 'string') {
                    parsedDate = new Date(usuarioAtual.birth_date);
                } else if (typeof (usuarioAtual.birth_date as any).toDate === 'function') {
                    parsedDate = (usuarioAtual.birth_date as any).toDate();
                } else if ((usuarioAtual.birth_date as any).seconds) {
                    parsedDate = new Date((usuarioAtual.birth_date as any).seconds * 1000);
                }
            }
            setDataNascimento(parsedDate);
            setAvatarUrl(usuarioAtual.avatar_url || '');
            setBio(usuarioAtual.bio || '');
            setCamisa(usuarioAtual.sizes?.camisa || '');
            setCalca(usuarioAtual.sizes?.calca || '');
            setCalcado(usuarioAtual.sizes?.calcado || '');
            setInteresses(usuarioAtual.interesses || []);
            
            getOrCreateWishlist(usuarioAtual.id, 'user').then(wishlist => {
                setGostos(wishlist.likes_tags || []);
                setOriginalGostos(wishlist.likes_tags || []);
                setEvitar(wishlist.avoids_tags || []);
                setOriginalEvitar(wishlist.avoids_tags || []);
            });
        }
    }, [usuarioAtual]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let changed = false;
        if (usuarioAtual) {
            if (nome !== (usuarioAtual.nome || '')) changed = true;
            if (genero !== (usuarioAtual.genero || '')) changed = true;
            if (avatarUrl !== (usuarioAtual.avatar_url || '')) changed = true;
            if (bio !== (usuarioAtual.bio || '')) changed = true;
            if (camisa !== (usuarioAtual.sizes?.camisa || '')) changed = true;
            if (calca !== (usuarioAtual.sizes?.calca || '')) changed = true;
            if (calcado !== (usuarioAtual.sizes?.calcado || '')) changed = true;

            let parsedDate: Date | undefined = undefined;
            if (usuarioAtual.birth_date) {
                if (typeof usuarioAtual.birth_date === 'string') {
                    parsedDate = new Date(usuarioAtual.birth_date);
                } else if (typeof (usuarioAtual.birth_date as any).toDate === 'function') {
                    parsedDate = (usuarioAtual.birth_date as any).toDate();
                } else if ((usuarioAtual.birth_date as any).seconds) {
                    parsedDate = new Date((usuarioAtual.birth_date as any).seconds * 1000);
                }
            }
            if (dataNascimento?.getTime() !== parsedDate?.getTime()) changed = true;

            if (JSON.stringify(gostos) !== JSON.stringify(originalGostos)) changed = true;
            if (JSON.stringify(evitar) !== JSON.stringify(originalEvitar)) changed = true;
        }
        setHasChanges(changed);
    }, [nome, genero, avatarUrl, bio, camisa, calca, calcado, dataNascimento, gostos, evitar, originalGostos, originalEvitar, usuarioAtual]);

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
    };

    const handleAddGosto = () => {
        const trimmed = novoGostoState.trim();
        if (trimmed && !gostos.includes(trimmed)) {
            setGostos((prev) => [...prev, trimmed]);
            setNovoGostoState('');
        }
    };

    const handleRemoveEvitar = (itemToRemove: string) => {
        setEvitar((prev) => prev.filter((item) => item !== itemToRemove));
    };

    const handleAddEvitar = () => {
        const trimmed = novoEvitarState.trim();
        if (trimmed && !evitar.includes(trimmed)) {
            setEvitar((prev) => [...prev, trimmed]);
            setNovoEvitarState('');
        }
    };

    const handleSalvar = async () => {
        if (!usuarioAtual) return;
        setIsSaving(true);
        clearMessages();
        try {
            let finalAvatarUrl = usuarioAtual.avatar_url;
            if (avatarUrl && avatarUrl !== finalAvatarUrl) {
                finalAvatarUrl = avatarUrl;
            }

            const updatedSizes = {
                ...(usuarioAtual.sizes || {}),
                camisa: camisa,
                calca: calca,
                calcado: calcado,
            };
            const updatedData: any = {
                avatar_url: finalAvatarUrl,
                sizes: updatedSizes,
                interesses: interesses,
            };

            if (nome) updatedData.nome = nome;
            if (genero) updatedData.genero = genero;
            if (dataNascimento) updatedData.birth_date = dataNascimento.toISOString();
            if (bio) updatedData.bio = bio;

            await updateUsuario(usuarioAtual.id, updatedData);
            
            const wishlist = await getOrCreateWishlist(usuarioAtual.id, 'user');
            const addedGostos = gostos.filter(g => !originalGostos.includes(g));
            const removedGostos = originalGostos.filter(g => !gostos.includes(g));
            const addedEvitar = evitar.filter(e => !originalEvitar.includes(e));
            const removedEvitar = originalEvitar.filter(e => !evitar.includes(e));

            if (addedGostos.length > 0) await addLikeTags(wishlist.id, addedGostos);
            if (removedGostos.length > 0) await removeLikeTags(wishlist.id, removedGostos);
            if (addedEvitar.length > 0) await addAvoidTags(wishlist.id, addedEvitar);
            if (removedEvitar.length > 0) await removeAvoidTags(wishlist.id, removedEvitar);

            setOriginalGostos(gostos);
            setOriginalEvitar(evitar);

            updateUsuarioAtual({ ...updatedData, gostos, evitar });
            setSuccessMessage('Perfil atualizado com sucesso!');
            setIsEditing(false);
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
        nome,
        setNome,
        genero,
        setGenero,
        generoOptions,
        dataNascimento,
        setDataNascimento,
        avatarUrl,
        setAvatarUrl,
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
        isEditing,
        setIsEditing,
        hasChanges,
    };
};
