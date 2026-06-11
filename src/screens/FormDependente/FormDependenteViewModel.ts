import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { storeDependentInCloud, updateDependentInCloud } from "../../services/cloud/Dependent/DependentDb";
import { Dependent, DependentType } from "../../types/Dependent";

export function useFormDependenteViewModel(navigation: any, dependentToEdit?: Dependent) {
    const { usuarioAtual } = useAuth();
    const [name, setName] = useState("");
    const [dependentType, setDependentType] = useState<DependentType | "">("");
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
    const [genderType, setGenderType] = useState("");
    const [customGender, setCustomGender] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [relationship, setRelationship] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Computed gender string for saving/editing compatibility
    const gender = genderType === "other" ? customGender : genderType;

    const setGender = (val: string) => {
        if (!val) {
            setGenderType("");
            setCustomGender("");
        } else if (val === "Masculino" || val === "Feminino") {
            setGenderType(val);
            setCustomGender("");
        } else {
            setGenderType("other");
            setCustomGender(val);
        }
    };

    const [errors, setErrors] = useState({
        name: "",
        dependentType: "",
        birthDate: "",
        gender: "",
        relationship: "",
    });

    useEffect(() => {
        if (dependentToEdit) {
            setName(dependentToEdit.name);
            setDependentType(dependentToEdit.dependent_type);
            setGender(dependentToEdit.gender || "");
            setBio(dependentToEdit.bio || "");
            setAvatarUrl(dependentToEdit.avatar_url || "");
            setRelationship(dependentToEdit.relationship || "");
            if (dependentToEdit.birth_date) {
                const [year, month, day] = dependentToEdit.birth_date.split("-").map(Number);
                // Evita problemas de timezone inicializando a data ao meio dia
                setBirthDate(new Date(year, month - 1, day, 12, 0, 0));
            }
        }
    }, [dependentToEdit]);

    const updateName = (text: string) => {
        setName(text);
        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
    };

    const updateDependentType = (type: string) => {
        setDependentType(type as DependentType);
        if (type !== "other") {
            setRelationship("");
        }
        if (errors.dependentType) setErrors((prev) => ({ ...prev, dependentType: "" }));
        if (errors.relationship) setErrors((prev) => ({ ...prev, relationship: "" }));
    };

    const updateBirthDate = (date: Date) => {
        setBirthDate(date);
        if (errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: "" }));
    };

    const updateGender = (text: string) => {
        setGender(text);
        if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" }));
    };

    const updateGenderType = (type: string) => {
        setGenderType(type);
        if (type !== "other") {
            setCustomGender("");
        }
        if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" }));
    };

    const updateCustomGender = (text: string) => {
        setCustomGender(text);
        if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" }));
    };

    const updateRelationship = (text: string) => {
        setRelationship(text);
        if (errors.relationship) setErrors((prev) => ({ ...prev, relationship: "" }));
    };

    const formatYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: "", dependentType: "", birthDate: "", gender: "", relationship: "" };

        if (!name.trim()) {
            newErrors.name = "O nome é obrigatório.";
            isValid = false;
        }

        if (!dependentType) {
            newErrors.dependentType = "O tipo de dependente é obrigatório.";
            isValid = false;
        }

        if (!birthDate) {
            newErrors.birthDate = "A data de nascimento é obrigatória.";
            isValid = false;
        }

        // Gênero é opcional, mas se selecionou "Outros" (other), o campo de customGender é obrigatório
        if (genderType === "other" && !customGender.trim()) {
            newErrors.gender = "O gênero é obrigatório para a opção Outros.";
            isValid = false;
        }

        if (dependentType === "other" && !relationship.trim()) {
            newErrors.relationship = "A relação é obrigatória para o tipo Outro.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!usuarioAtual) return;
        if (!validateForm()) return;

        setIsSaving(true);

        const birthDateString = formatYYYYMMDD(birthDate!);
        
        let finalAvatarUrl = avatarUrl;
        if (!finalAvatarUrl) {
            finalAvatarUrl = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
        }

        try {
            if (dependentToEdit) {
                await updateDependentInCloud(dependentToEdit.id, {
                    name: name.trim(),
                    dependent_type: dependentType as DependentType,
                    birth_date: birthDateString,
                    gender: gender.trim(),
                    bio: bio.trim(),
                    avatar_url: finalAvatarUrl,
                    relationship: dependentType === "other" ? relationship.trim() : undefined,
                });
            } else {
                await storeDependentInCloud({
                    user_id: usuarioAtual.id,
                    name: name.trim(),
                    dependent_type: dependentType as DependentType,
                    birth_date: birthDateString,
                    gender: gender.trim(),
                    bio: bio.trim(),
                    avatar_url: finalAvatarUrl,
                    relationship: dependentType === "other" ? relationship.trim() : undefined,
                });
            }

            navigation.goBack();
        } catch (error) {
            console.error("Erro ao salvar dependente:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        name,
        dependentType,
        birthDate,
        gender,
        genderType,
        customGender,
        bio,
        avatarUrl,
        relationship,
        isSaving,
        errors,
        updateName,
        updateDependentType,
        updateBirthDate,
        updateGender,
        updateGenderType,
        updateCustomGender,
        updateRelationship,
        setBio,
        setAvatarUrl,
        handleSave,
    };
}
