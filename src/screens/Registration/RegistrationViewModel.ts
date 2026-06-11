import { useState } from "react";
import { isValidEmail } from "../../utils/Formatting/isValidEmail";
import { UserRegistrationDTO } from "../../dto/User/UserRegistrationDTO";
import { storeUserInCloud } from "../../services/cloud/User/UserDb";

export function useRegistrationViewModel(navigation: any) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [genero, setGenero] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [sizes, setSizes] = useState<Map<string, string>>(new Map());
  const [errors, setErrors] = useState({ nome: "", email: "", senha: "", genero: "", data: "" });
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const camisetaOptions = ["PP", "P", "M", "G", "GG"].map((size) => ({
    key: size,
    label: size,
    value: size,
  }));

  const calcaOptions = ["36", "38", "40", "42", "44", "46"].map((size) => ({
    key: size,
    label: size,
    value: size,
  }));

  const calcadoOptions = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43"].map((size) => ({
    key: size,
    label: size,
    value: size,
  }));

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

  const updateGenero = (text: string) => {
    setGenero(text);
    if (errors.genero) setErrors((prev) => ({ ...prev, genero: "" }));
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
  };

  const updateSizes = (key: string, value: string) => {
    setSizes((prev) => {
      const updated = new Map(prev);
      updated.set(key, value);
      return updated;
    });
  };

  const hasChanges = nomeUsuario !== "" ||  email !== "" || senha !== "" || genero !== "" || dataNascimento !== undefined || avatarUrl !== "" || bio !== "";

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
    let newErrors = { nome: "", email: "", senha: "", genero: "", data: "" };

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

    if (!genero) {
      newErrors.genero = "O gênero é obrigatório.";
      isValid = false;
    }

    if (!dataNascimento) {
      newErrors.data = "A data de nascimento é obrigatória.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

  try {
    const userRegistrationDTO: UserRegistrationDTO = {
      email: email,
      senha: senha,
      nome: nomeUsuario,
      genero: genero,
      birth_date: dataNascimento!,
      //height: height,
      avatar_url: avatarUrl,
      bio: bio,
      sizes: {
        camisa: sizes.get("camiseta"),
        calca: sizes.get("calca"),
        calcado: sizes.get("calcado"),
      },
    };
    const loggedUser = await storeUserInCloud(userRegistrationDTO);
    if (loggedUser) {
      navigation.replace("Home"); 
    }

  } catch (error: any) {
    console.error("Erro no processo de cadastro:", error);
    if (error.code === "auth/email-already-in-use") {
      newErrors.email = "Este e-mail já está em uso por outra conta.";
    } else if (error.code === "auth/weak-password") {
      newErrors.senha = "A senha fornecida é muito fraca.";
    }
    setErrors(newErrors);
  }
};

  return {
    nomeUsuario,
    updateNomeUsuario,
    email,
    updateEmail,
    senha,
    updateSenha,
    genero,
    updateGenero,
    dataNascimento,
    updateDataNascimento,
    avatarUrl,
    updateAvatarUrl,
    bio,
    updateBio,
    sizes,
    updateSizes,
    camisetaOptions,
    calcaOptions,
    calcadoOptions,
    errors,
    isModalVisible,
    cancelExit,
    handleBackPress,
    confirmExit,
    handleCadastrarUsuario,
  };
};