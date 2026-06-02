import { useState } from "react";
import { isValidEmail } from "../../utils/Formatting/isValidEmail";

export function useForgotMyPasswordViewModel(navigation: any) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });

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

    if (!email) {
      newErrors.email = "Insira seu email.";
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email inválido.";
      isValid = false;
    }
    
    setErrors(newErrors);

    if (!isValid) return;

    /*Código referente a alteração de senha da T24 irá aqui*/
  };

  return {
    email,
    updateEmail,
    errors,
    handleBackPress,
    handleVerificarEmail,
  };
};