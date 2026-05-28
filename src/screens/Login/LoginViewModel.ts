import { useState } from "react";
import { isValidEmail } from "../../utils/Formatting/isValidEmail";

export function useLoginViewModel(navigation: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState({ email: "", senha: "" });

  const updateEmail = (text: string) => {
    setEmail(text);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  const updateSenha = (text: string) => {
    setSenha(text);
    if (errors.senha) setErrors((prev) => ({ ...prev, senha: "" }));
  };

  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleRegistrationNavigate = () => {
    navigation.navigate("Registration");
  };
  const handleForgotMyPasswordNavigate = () => {
    navigation.navigate("ForgotMyPassword");
  };

  const handleAutenticarUsuario = async () => {
    let isValid = true;
    let newErrors = { email: "", senha: "" };

    if (!email) {
      newErrors.email = "Insira seu email.";
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email inválido.";
      isValid = false;
    }

    if (!senha) {
      newErrors.senha = "Insira sua senha.";
      isValid = false;
    }
    
    setErrors(newErrors);

    if (!isValid) return;

    /*Código referente a Login da T24 irá aqui*/
  };

  return {
    email,
    updateEmail,
    senha,
    updateSenha,
    errors,
    handleBackPress,
    handleRegistrationNavigate,
    handleForgotMyPasswordNavigate,
    handleAutenticarUsuario,
  };
};