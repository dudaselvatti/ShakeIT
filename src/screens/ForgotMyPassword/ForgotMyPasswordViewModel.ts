import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { useState } from "react";
import { isValidEmail } from "../../utils/Formatting/isValidEmail";
import { resetUserPassword } from "../../services/cloud/User/UserDb";
import { UserForgotMyPasswordDTO } from "../../dto/User/UserForgotMyPasswordDTO";

export function useForgotMyPasswordViewModel(navigation: any) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const [success, setSuccess] = useState("");
  const [isLoading, setLoading] = useState(true);

  const updateEmail = (text: string) => {
    setEmail(text);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleVerificarEmail = async () => {
    let isValid = true;
    let newErrors = { email: "" };
    setSuccess("");

    if (!email) {
      newErrors.email = "Insira seu email.";
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email inválido.";
      isValid = false;
    }
    
    setErrors(newErrors);

    if (!isValid) return;

    try {
      setLoading(true);
      const userForgotMyPasswordDTO: UserForgotMyPasswordDTO = {
        email: email
      }
      await resetUserPassword(userForgotMyPasswordDTO);
      setErrors({ email: "" });
      setSuccess("O link de redefinição de senha foi enviado para o seu e-mail.");
    } catch (error: any) {
      setSuccess("");
      console.error("Erro ao resetar senha:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
      if (error.code === "auth/user-not-found") {
        setErrors({ email: "Este e-mail não está cadastrado." });
      } else if (error.code === "auth/invalid-email") {
        setErrors({ email: "O formato do e-mail é inválido." });
      } else {
        setErrors({ email: "Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde." });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    updateEmail,
    isLoading,
    errors,
    success,
    handleBackPress,
    handleVerificarEmail,
  };
};