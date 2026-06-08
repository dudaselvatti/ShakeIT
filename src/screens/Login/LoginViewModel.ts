import { useState } from "react";
import { isValidEmail } from "../../utils/Formatting/isValidEmail";
import { userLogin } from "../../services/cloud/User/UserDb";
import { UserLoginDTO } from "../../dto/User/UserLoginDTO";

export function useLoginViewModel(navigation: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState({ email: "", senha: "", firebase: "" });

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
    let newErrors = { email: "", senha: "", firebase: "" };

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

    try {
      const userLoginDTO: UserLoginDTO = {
        email: email,
        senha: senha,
      }
      const loggedUser = await userLogin(userLoginDTO);
      if (loggedUser) {
        navigation.replace("Home"); 
      }
    } catch (error: any) {
      console.error("Erro ao autenticar no Firebase:", error);
      
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          newErrors.firebase = "E-mail ou senha incorretos.";
          break;
        case "auth/too-many-requests":
          newErrors.firebase = "Acesso bloqueado temporariamente por excesso de tentativas.";
          break;
        default:
          newErrors.firebase = "Ocorreu um erro ao fazer login. Tente novamente."
      }
      setErrors(newErrors);
    } 
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