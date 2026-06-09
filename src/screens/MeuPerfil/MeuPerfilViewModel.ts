import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext/AuthContext';
import { updateUsuario } from '../../services/cloud/User/UserDb';

export const useMeuPerfilViewModel = () => {
    const { usuarioAtual, updateUsuarioAtual } = useAuth();
    const [bio, setBio] = useState('');
    const [camisa, setCamisa] = useState('');
    const [calca, setCalca] = useState('');
    const [calcado, setCalcado] = useState('');
    const [interesses, setInteresses] = useState<string[]>([]);
    const [novoInteresse, setNovoInteresse] = useState('');
    const [gostos, setGostos] = useState<string[]>([]);
    const [evitar, setEvitar] = useState<string[]>([]);
    const [novoGosto, setNovoGosto] = useState('');
    const [novoEvitar, setNovoEvitar] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        if (usuarioAtual) {
            setBio(usuarioAtual.bio || '');
            setCamisa(usuarioAtual.sizes?.camisa || '');
            setCalca(usuarioAtual.sizes?.calca || '');
            setCalcado(usuarioAtual.sizes?.calcado || '');
            setInteresses(usuarioAtual.interesses || []);
            setGostos(usuarioAtual.gostos || []);
            setEvitar(usuarioAtual.evitar || []);
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
    };

    const handleAddGosto = () => {
        const trimmed = novoGosto.trim();
        if (trimmed && !gostos.includes(trimmed)) {
            setGostos((prev) => [...prev, trimmed]);
            setNovoGosto('');
        }
    };

    const handleRemoveEvitar = (itemToRemove: string) => {
        setEvitar((prev) => prev.filter((item) => item !== itemToRemove));
    };

    const handleAddEvitar = () => {
        const trimmed = novoEvitar.trim();
        if (trimmed && !evitar.includes(trimmed)) {
            setEvitar((prev) => [...prev, trimmed]);
            setNovoEvitar('');
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
                gostos: gostos,
                evitar: evitar,
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
        novoGosto,
        setNovoGosto,
        handleAddGosto,
        handleRemoveGosto,
        evitar,
        setEvitar,
        novoEvitar,
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
