import { Alert } from 'react-native';
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import {
  storeDependentInCloud,
  updateDependentInCloud,
} from "../../services/cloud/Dependent/DependentDb";
import {
  getOrCreateWishlist,
  addLikeTags,
  removeLikeTags,
  addAvoidTags,
  removeAvoidTags,
} from "../../services/cloud/Wishlist/WishlistDb";
import { Dependent, DependentType } from "../../types/Dependent";

export function useFormDependenteViewModel(
  navigation: any,
  dependentToEdit?: Dependent,
) {
  const { usuarioAtual } = useAuth();
  const [name, setName] = useState("");
  const [dependentType, setDependentType] = useState<DependentType | "">("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [genderType, setGenderType] = useState("");
  const [customGender, setCustomGender] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [relationship, setRelationship] = useState("");

  // Novas states para medidas
  const [tamanhoCamisa, setTamanhoCamisa] = useState("");
  const [tamanhoCalca, setTamanhoCalca] = useState("");
  const [tamanhoCalcado, setTamanhoCalcado] = useState("");

  // Novas states para wishlist do dependente
  const [gostos, setGostos] = useState<string[]>([]);
  const [originalGostos, setOriginalGostos] = useState<string[]>([]);
  const [novoGostoState, setNovoGostoState] = useState("");

  const [evitar, setEvitar] = useState<string[]>([]);
  const [originalEvitar, setOriginalEvitar] = useState<string[]>([]);
  const [novoEvitarState, setNovoEvitarState] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const dependentOptions = ["Filho(a)", "Pet", "Outro"].map((size) => ({
    key: size,
    label: size,
    value: size,
  }));

  const generoOptions = ["Masculino", "Feminino", "Outro"].map((size) => ({
    key: size,
    label: size,
    value: size,
  }));

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
        const [year, month, day] = dependentToEdit.birth_date
          .split("-")
          .map(Number);
        // Evita problemas de timezone inicializando a data ao meio dia
        setBirthDate(new Date(year, month - 1, day, 12, 0, 0));
      }

      if (dependentToEdit.sizes) {
        setTamanhoCamisa(dependentToEdit.sizes.camisa || "");
        setTamanhoCalca(dependentToEdit.sizes.calca || "");
        setTamanhoCalcado(dependentToEdit.sizes.calcado || "");
      }

      // Buscar Wishlist do dependente
      getOrCreateWishlist(dependentToEdit.id, "dependent").then((wishlist) => {
        setGostos(wishlist.likes_tags || []);
        setOriginalGostos(wishlist.likes_tags || []);
        setEvitar(wishlist.avoids_tags || []);
        setOriginalEvitar(wishlist.avoids_tags || []);
      });
    }
  }, [dependentToEdit]);

  useEffect(() => {
    let changed = false;
    if (dependentToEdit) {
        if (name !== dependentToEdit.name) changed = true;
        if (dependentType !== dependentToEdit.dependent_type) changed = true;
        if (gender !== (dependentToEdit.gender || '')) changed = true;
        if (bio !== (dependentToEdit.bio || '')) changed = true;
        if (avatarUrl !== (dependentToEdit.avatar_url || '')) changed = true;
        if (relationship !== (dependentToEdit.relationship || '')) changed = true;
        
        if (dependentToEdit.birth_date) {
           const [year, month, day] = dependentToEdit.birth_date.split("-").map(Number);
           const originalDate = new Date(year, month - 1, day, 12, 0, 0);
           if (birthDate?.getTime() !== originalDate.getTime()) changed = true;
        } else if (birthDate) {
           changed = true;
        }

        if (tamanhoCamisa !== (dependentToEdit.sizes?.camisa || '')) changed = true;
        if (tamanhoCalca !== (dependentToEdit.sizes?.calca || '')) changed = true;
        if (tamanhoCalcado !== (dependentToEdit.sizes?.calcado || '')) changed = true;
        
        if (JSON.stringify(gostos) !== JSON.stringify(originalGostos)) changed = true;
        if (JSON.stringify(evitar) !== JSON.stringify(originalEvitar)) changed = true;
    } else {
        changed = name !== "" || dependentType !== "" || birthDate !== undefined;
    }
    setHasChanges(changed);
  }, [name, dependentType, gender, bio, avatarUrl, relationship, birthDate, tamanhoCamisa, tamanhoCalca, tamanhoCalcado, gostos, evitar, originalGostos, originalEvitar, dependentToEdit]);

  const updateName = (text: string) => {
    setName(text);
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  const updateDependentType = (type: string) => {
    setDependentType(type as DependentType);
    if (type !== "other") {
      setRelationship("");
    }
    if (errors.dependentType)
      setErrors((prev) => ({ ...prev, dependentType: "" }));
    if (errors.relationship)
      setErrors((prev) => ({ ...prev, relationship: "" }));
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
    if (errors.relationship)
      setErrors((prev) => ({ ...prev, relationship: "" }));
  };

  const handleRemoveGosto = (itemToRemove: string) => {
    setGostos((prev) => prev.filter((item) => item !== itemToRemove));
  };

  const handleAddGosto = () => {
    const trimmed = novoGostoState.trim();
    if (trimmed && !gostos.includes(trimmed)) {
      setGostos((prev) => [...prev, trimmed]);
      setNovoGostoState("");
    }
  };

  const handleRemoveEvitar = (itemToRemove: string) => {
    setEvitar((prev) => prev.filter((item) => item !== itemToRemove));
  };

  const handleAddEvitar = () => {
    const trimmed = novoEvitarState.trim();
    if (trimmed && !evitar.includes(trimmed)) {
      setEvitar((prev) => [...prev, trimmed]);
      setNovoEvitarState("");
    }
  };

  const formatYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      dependentType: "",
      birthDate: "",
      gender: "",
      relationship: "",
    };

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
      finalAvatarUrl =
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    }

    try {
      const dataToSave: any = {
        name: name.trim(),
        dependent_type: dependentType as DependentType,
        birth_date: birthDateString,
        gender: gender.trim(),
        bio: bio.trim(),
        avatar_url: finalAvatarUrl,
        sizes: {
          camisa: tamanhoCamisa.trim(),
          calca: tamanhoCalca.trim(),
          calcado: tamanhoCalcado.trim(),
        }
      };

      if (dependentType === "other") {
        dataToSave.relationship = relationship.trim();
      }

      let dependentId = dependentToEdit?.id;

      if (dependentToEdit) {
        await updateDependentInCloud(dependentToEdit.id, dataToSave);
      } else {
        const created = await storeDependentInCloud({
          user_id: usuarioAtual.id,
          ...dataToSave,
        });
        dependentId = created.id;
      }

      if (dependentId) {
        const wishlist = await getOrCreateWishlist(dependentId, "dependent");
        const addedGostos = gostos.filter((g) => !originalGostos.includes(g));
        const removedGostos = originalGostos.filter((g) => !gostos.includes(g));
        const addedEvitar = evitar.filter((e) => !originalEvitar.includes(e));
        const removedEvitar = originalEvitar.filter((e) => !evitar.includes(e));

        if (addedGostos.length > 0) await addLikeTags(wishlist.id, addedGostos);
        if (removedGostos.length > 0)
          await removeLikeTags(wishlist.id, removedGostos);
        if (addedEvitar.length > 0)
          await addAvoidTags(wishlist.id, addedEvitar);
        if (removedEvitar.length > 0)
          await removeAvoidTags(wishlist.id, removedEvitar);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar dependente:", error);
      setErrorModalMessage("Sistema indisponível no momento. Tente novamente mais tarde.");
      setIsErrorModalVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    name,
    dependentType,
    dependentOptions,
    birthDate,
    gender,
    genderType,
    generoOptions,
    customGender,
    bio,
    avatarUrl,
    relationship,
    tamanhoCamisa,
    setTamanhoCamisa,
    tamanhoCalca,
    setTamanhoCalca,
    tamanhoCalcado,
    setTamanhoCalcado,
    isSaving,
    errors,
    gostos,
    novoGostoState,
    setNovoGostoState,
    evitar,
    novoEvitarState,
    setNovoEvitarState,
    updateName,
    updateDependentType,
    updateBirthDate,
    updateGender,
    updateGenderType,
    updateCustomGender,
    updateRelationship,
    setBio,
    setAvatarUrl,
    handleAddGosto,
    handleRemoveGosto,
    handleAddEvitar,
    handleRemoveEvitar,
    handleSave,
    isErrorModalVisible,
    errorModalMessage,
    closeErrorModal: () => setIsErrorModalVisible(false),
    hasChanges,
  };
}
