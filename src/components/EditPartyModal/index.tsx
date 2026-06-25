import React from "react";
import { View, Text, Modal, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Button } from "../Button";
import { Input } from "../Input";
import { DateInput } from "../DateInput";
import { CurrencyInput } from "../CurrencyInput";
import { createStyles } from "./styles";
import { useEditPartyModalViewModel, Props } from "./EditPartyModalViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";

export const EditPartyModal = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const {
        nomeParty,
        updateNomeParty,
        dataRevelacao,
        updateDataRevelacao,
        valorMinimo,
        updateValorMinimo,
        valorMaximo,
        updateValorMaximo,
        errors,
        handleSalvar,
        isLoading,
        hasChanges
    } = useEditPartyModalViewModel(props);

    if (!props.visible) return null;

    return (
        <Modal transparent visible={props.visible} animationType="slide">
            <KeyboardAvoidingView 
                style={styles.overlay} 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Editar Evento</Text>
                    
                    <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                        <Input
                            label="Nome da Party"
                            placeholder="Ex: Amigo Secreto da Firma"
                            value={nomeParty}
                            onChangeText={updateNomeParty}
                            maxLength={30}
                        />
                        {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

                        <DateInput
                            display="spinner"
                            label="Data da Revelação"
                            value={dataRevelacao}
                            onChangeDate={updateDataRevelacao}
                            minimumDate={new Date()}
                        />
                        {errors.data ? <Text style={styles.errorText}>{errors.data}</Text> : null}

                        <View style={styles.row}>
                            <CurrencyInput
                                label="Valor Mínimo"
                                placeholder="0,00"
                                value={valorMinimo}
                                onChangeText={updateValorMinimo}
                                containerStyle={{ width: "48%" }}
                            />
                            <CurrencyInput
                                label="Valor Máximo"
                                placeholder="50,00"
                                value={valorMaximo}
                                onChangeText={updateValorMaximo}
                                containerStyle={{ width: "48%" }}
                            />
                        </View>
                        {errors.valores ? <Text style={styles.errorText}>{errors.valores}</Text> : null}
                    </ScrollView>

                    <View style={styles.buttonRow}>
                        <Button 
                            title="Cancelar" 
                            variant="outline" 
                            onPress={props.onClose} 
                            style={styles.button}
                            disabled={isLoading}
                        />
                        <View style={{ width: 16 }} />
                        {hasChanges ? (
                            <Button 
                                title="Salvar" 
                                onPress={handleSalvar} 
                                style={styles.button}
                                isLoading={isLoading}
                                disabled={isLoading || !nomeParty}
                            />
                        ) : (
                            <View style={styles.button} />
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
