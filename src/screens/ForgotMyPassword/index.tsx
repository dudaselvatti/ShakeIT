import React from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { AppHeader } from "../../components/AppHeader";
import { createStyles } from "./styles";

import { useForgotMyPasswordViewModel } from "./ForgotMyPasswordViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";

export const ForgotMyPasswordScreen = ({ navigation }: any) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const {
    email,
    updateEmail,
    errors,
    success,
    handleBackPress,
    handleVerificarEmail,
  } = useForgotMyPasswordViewModel(navigation);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <AppHeader 
        headerTitle="Esqueci minha senha" 
        showBackButton={true} 
        onBackPress={handleBackPress}
        showSettingsIcon={true}
      />

      <View style={styles.content}>
        <Input
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={updateEmail}
          maxLength={60}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}
      </View>

      <View style={styles.buttonsView}>
        <Button
          title="Enviar"
          onPress={handleVerificarEmail}
        />
      </View>

    </KeyboardAvoidingView>
  );
};