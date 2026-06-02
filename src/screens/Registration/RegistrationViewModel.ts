import { useState } from "react";
import { isValidEmail } from "../../utils/Formatting/isValidEmail";

export function useRegistrationViewModel(navigation: any) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [sizes, setSizes] = useState<Map<string, string>>(new Map());
  const [errors, setErrors] = useState({ nome: "", email: "", senha: "", data: "", bio: "" });
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const updateNomeUsuario = (text: string) => {
    setNomeUsuario(text);
    if (errors.nome) setErrors((prev) => ({ ...prev, nome: "" }));
  };

  const updateEmail = (text: string) => {
    setEmail(text);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  const updateSenha = (text: string) => {
    setSenha(text);
    if (errors.senha) setErrors((prev) => ({ ...prev, senha: "" }));
  };

  const updateDataNascimento = (date: Date) => {
    setDataNascimento(date);
    if (errors.data) setErrors((prev) => ({ ...prev, data: "" }));
  };

  const updateAvatarUrl = (text: string) => {
    setAvatarUrl(text);
  };

  const updateBio = (text: string) => {
    setBio(text);
    if (errors.bio) setErrors((prev) => ({ ...prev, bio: "" }));
  };

  const updateSizes = (key: string, value: string) => {
    setSizes((prev) => {
      const updated = new Map(prev);
      updated.set(key, value);
      return updated;
    });
  };

  const hasChanges = nomeUsuario !== "" ||  email !== "" || senha !== "" || dataNascimento !== undefined || avatarUrl !== "" || bio !== "";

  const handleBackPress = () => {
    if (hasChanges) {
      setPendingRoute(null);
      setModalVisible(true);
    } else {
      navigation.goBack();
    }
  };
  const cancelExit = () => setModalVisible(false);
  const confirmExit = () => {
    setModalVisible(false);
    if (pendingRoute) {
      navigation.navigate(pendingRoute);
    } else {
      navigation.goBack();
    }
  };

  const handleCadastrarUsuario = async () => {
    let isValid = true;
    let newErrors = { nome: "", email: "", senha: "", data: "", bio: "" };

    if (!nomeUsuario.trim()) {
      newErrors.nome = "O nome de usuário é obrigatório.";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "O email é obrigatório.";
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email inválido.";
      isValid = false;
    }

    if (!senha) {
      newErrors.senha = "A senha é obrigatória.";
      isValid = false;
    }

    if (!dataNascimento) {
      newErrors.data = "A data de nascimento é obrigatória.";
      isValid = false;
    }

    if (!bio) {
      newErrors.bio = "A bio é obrigatória.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    /*const novoUsuario: Omit<Usuario, id> = { //Deverá ser implementado na T22, de preferência após a T19
      
    }

    try {
    const registeredUser = await registerUserInCloud(novoUsuario);

      console.log("Usuário cadastrado:", registeredUser);

      navigation.navigate("Home");

    } catch (error) {
      console.error("Erro ao cadastrar Usuario no Firebase:", error);
      setErrors((prev) => ({
        ...prev,
        nome: "Erro ao cadastrar o usuário. Tente novamente.",
      }));
    }*/
  };

  return {
    nomeUsuario,
    updateNomeUsuario,
    email,
    updateEmail,
    senha,
    updateSenha,
    dataNascimento,
    updateDataNascimento,
    avatarUrl,
    updateAvatarUrl,
    bio,
    updateBio,
    sizes,
    updateSizes,
    errors,
    isModalVisible,
    cancelExit,
    handleBackPress,
    confirmExit,
    handleCadastrarUsuario,
  };
};