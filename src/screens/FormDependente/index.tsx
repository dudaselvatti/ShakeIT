import React from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { SelectInput } from "../../components/SelectInput";
import { DateInput } from "../../components/DateInput";
import { styles } from "./styles";
import { useFormDependenteViewModel } from "./FormDependenteViewModel";

export const FormDependenteScreen = ({ navigation }: any) => {
    const route = useRoute<any>();
    const dependentToEdit = route.params?.dependent;

    const {
        name,
        dependentType,
        birthDate,
        genderType,
        customGender,
        bio,
        relationship,
        isSaving,
        errors,
        updateName,
        updateDependentType,
        updateBirthDate,
        updateGenderType,
        updateCustomGender,
        updateRelationship,
        setBio,
        handleSave,
    } = useFormDependenteViewModel(navigation, dependentToEdit);

    const getTypeValue = (type: string) => {
        if (type === "child") return "Filho(a)";
        if (type === "pet") return "Pet";
        if (type === "other") return "Outro";
        return "";
    };

    const handleTypeChange = (label: string) => {
        if (label === "Filho(a)") updateDependentType("child");
        else if (label === "Pet") updateDependentType("pet");
        else if (label === "Outro") updateDependentType("other");
        else updateDependentType("");
    };

    const getGenderValue = (type: string) => {
        if (type === "Masculino") return "Masculino";
        if (type === "Feminino") return "Feminino";
        if (type === "other") return "Outros";
        return "";
    };

    const handleGenderChange = (label: string) => {
        if (label === "Masculino") updateGenderType("Masculino");
        else if (label === "Feminino") updateGenderType("Feminino");
        else if (label === "Outros") updateGenderType("other");
        else updateGenderType("");
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                headerTitle={dependentToEdit ? "Editar Dependente" : "Novo Dependente"}
                showBackButton={true}
                showSettingsIcon={true}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 80}
            >
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Input
                        label="Nome"
                        placeholder="Nome do dependente"
                        value={name}
                        onChangeText={updateName}
                        maxLength={50}
                        testID="input-nome"
                    />
                    {errors.name ? <Text style={styles.errorText} testID="error-nome">{errors.name}</Text> : null}

                    <View style={styles.row}>
                        <View style={styles.halfColumn}>
                            <SelectInput
                                label="Tipo de Dependente"
                                selectedValue={getTypeValue(dependentType)}
                                onValueChange={handleTypeChange}
                                options={["Filho(a)", "Pet", "Outro"]}
                                containerStyle={{ marginBottom: 12 }}
                                testID="select-tipo"
                            />
                            {errors.dependentType ? (
                                <Text style={styles.errorText} testID="error-tipo">{errors.dependentType}</Text>
                            ) : null}
                        </View>

                        <View style={{ width: 16 }} />

                        <View style={styles.halfColumn}>
                            <DateInput
                                display="spinner"
                                label="Data de Nascimento"
                                value={birthDate}
                                onChangeDate={updateBirthDate}
                                maximumDate={new Date()}
                                containerStyle={{ marginBottom: 12 }}
                                testID="date-birth"
                            />
                            {errors.birthDate ? (
                                <Text style={styles.errorText} testID="birth-date-error">{errors.birthDate}</Text>
                            ) : null}
                        </View>
                    </View>

                    {dependentType === "other" ? (
                        <>
                            <Input
                                label="Relação / Parentesco"
                                placeholder="Ex: Sobrinho, Afilhado, etc."
                                value={relationship}
                                onChangeText={updateRelationship}
                                maxLength={50}
                                testID="input-relacionamento"
                            />
                            {errors.relationship ? (
                                <Text style={styles.errorText} testID="error-relacionamento">{errors.relationship}</Text>
                            ) : null}
                        </>
                    ) : null}

                    <SelectInput
                        label="Gênero"
                        selectedValue={getGenderValue(genderType)}
                        onValueChange={handleGenderChange}
                        options={["Masculino", "Feminino", "Outros"]}
                        containerStyle={{ marginBottom: 12 }}
                        testID="select-genero"
                    />
                    {errors.gender ? <Text style={styles.errorText} testID="error-genero">{errors.gender}</Text> : null}

                    {genderType === "other" ? (
                        <>
                            <Input
                                label="Especifique o Gênero"
                                placeholder="Ex: Macho, Fêmea, Não-binário..."
                                value={customGender}
                                onChangeText={updateCustomGender}
                                maxLength={20}
                                testID="input-genero-custom"
                            />
                            {errors.gender ? (
                                <Text style={styles.errorText} testID="error-genero-custom">{errors.gender}</Text>
                            ) : null}
                        </>
                    ) : null}

                    <Input
                        label="Bio (Opcional)"
                        placeholder="Ex: Gosta de brinquedos barulhentos"
                        value={bio}
                        onChangeText={setBio}
                        maxLength={200}
                        multiline
                        numberOfLines={3}
                        testID="input-bio"
                    />
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title={dependentToEdit ? "Salvar Alterações" : "Cadastrar"}
                        onPress={handleSave}
                        isLoading={isSaving}
                        testID="btn-salvar"
                    />
                </View>
            </KeyboardAvoidingView>

            <AppFooter />
        </SafeAreaView>
    );
};
