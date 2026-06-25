import React, { useRef } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PopupModal } from "../../components/PopupModal";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { DateInput } from "../../components/DateInput";
import { AppHeader } from "../../components/AppHeader";
import { createStyles } from "./styles";

import { useRegistrationViewModel } from "./RegistrationViewModel";
import { ImagePicker } from "../../components/ImagePicker";
import { SelectInput } from "../../components/SelectInput";
import { useAppTheme } from "../../contexts/ThemeContext";

export const RegistrationScreen = ({ navigation }: any) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
  const {
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
    generoOptions,
    camisetaOptions,
    calcaOptions,
    calcadoOptions,
    errors,
    isModalVisible,
    cancelExit,
    handleBackPress,
    confirmExit,
    handleCadastrarUsuario,
    isLoading,
  } = useRegistrationViewModel(navigation);

  const scrollViewRef = useRef<ScrollView>(null);

  const onRegisterPress = async () => {
    const result = await handleCadastrarUsuario();
    if (result && !result.success) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top', 'bottom']}>
        <AppHeader 
          headerTitle="Cadastre-se" 
          showBackButton={true} 
          onBackPress={handleBackPress}
          showSettingsIcon={true}
        />

      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>

        <Input
          label="Nome de usuário *"
          placeholder="Nome de usuário"
          value={nomeUsuario}
          onChangeText={updateNomeUsuario}
          maxLength={50}
        />
        {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

        <Input
          label="Email *"
          placeholder="Email"
          value={email}
          onChangeText={updateEmail}
          maxLength={60}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Input
          label="Senha *"
          placeholder="Senha"
          value={senha}
          onChangeText={updateSenha}
          maxLength={50}
          autoCapitalize="none"
          isPassword={true}
        />
        {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}
        
        <SelectInput
          label="Gênero *"
          selectedValue={genero}
          onValueChange={updateGenero}
          options={generoOptions}
        />
        {errors.genero ? <Text style={styles.errorText}>{errors.genero}</Text> : null}

        <DateInput
          display="spinner"
          label="Data de Nascimento *"
          value={dataNascimento}
          onChangeDate={updateDataNascimento}
          maximumDate={new Date()}
        />
        {errors.data ? <Text style={styles.errorText}>{errors.data}</Text> : null}

        <ImagePicker
          label="Foto de Perfil"
          value={avatarUrl}
          onChangeImage={updateAvatarUrl}
        />

        <Input
          label="Bio"
          placeholder="Bio"
          value={bio}
          onChangeText={updateBio}
          maxLength={1000}
          multiline
          numberOfLines={4}
        />

        <SelectInput
          label="Tamanho da Camiseta"
          selectedValue={sizes.get("camiseta") || ""}
          onValueChange={(value) => updateSizes("camiseta", value)}
          options={camisetaOptions}
        />
        <SelectInput
          label="Tamanho da Calça"
          selectedValue={sizes.get("calca") || ""}
          onValueChange={(value) => updateSizes("calca", value)}
          options={calcaOptions}
        />
        <SelectInput
          label="Tamanho do Calçado"
          selectedValue={sizes.get("calcado") || ""}
          onValueChange={(value) => updateSizes("calcado", value)}
          options={calcadoOptions}
        />

        {errors.firebase ? <Text style={[styles.firebaseErrorText]}>{errors.firebase}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Criar Conta"
          onPress={onRegisterPress}
          isLoading={isLoading}
        />
      </View>

      <PopupModal
        visible={isModalVisible}
        title="Atenção!"
        message="Se você voltar agora, os dados do seu cadastro serão perdidos. Deseja sair?"
        cancelText="Cancelar"
        confirmText="Sair sem salvar"
        onCancel={cancelExit}
        onConfirm={confirmExit}
      />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};