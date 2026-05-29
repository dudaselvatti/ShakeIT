import React from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { AppHeader } from "../../components/AppHeader";
import { styles } from "./styles";

import { useLoginViewModel } from "./LoginViewModel";

export const LoginScreen = ({ navigation }: any) => {
  const {
    email,
    updateEmail,
    senha,
    updateSenha,
    errors,
    handleBackPress,
    handleRegistrationNavigate,
    handleForgotMyPasswordNavigate,
    handleAutenticarUsuario,
  } = useLoginViewModel(navigation);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <AppHeader 
        headerTitle="Login" 
        showBackButton={true} 
        onBackPress={handleBackPress}
        showSettingsIcon={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={updateEmail}
          maxLength={60}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        <Input
          label="Senha"
          placeholder="Senha"
          value={senha}
          onChangeText={updateSenha}
          maxLength={50}
        />
        {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}
      </ScrollView>

      <View style={styles.buttonsView}>
        <Button
          title="Entrar"
          onPress={handleAutenticarUsuario}
        />
        <Button
          title="Criar Conta"
          onPress={handleRegistrationNavigate}
          variant="redNoOutline"
        />
        <Button
          title="Esqueci minha senha"
          onPress={handleForgotMyPasswordNavigate}
          variant="text"
        />
      </View>

    </KeyboardAvoidingView>
  );
};