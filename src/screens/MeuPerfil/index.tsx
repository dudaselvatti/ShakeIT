import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Tag } from '../../components/Tag';
import { PopupModal } from '../../components/PopupModal';
import { styles } from './styles';
import { theme } from '../../styles/theme';
import { useMeuPerfilViewModel } from './MeuPerfilViewModel';

interface SizeCardProps {
    title: string;
    emoji: string;
    placeholder: string;
    selectedValue: string;
    onValueChange: (val: string) => void;
    options: string[];
}

const SizeCard = ({ title, emoji, placeholder, selectedValue, onValueChange, options }: SizeCardProps) => {
    const renderPlaceholderText = (text: string) => {
        if (text.startsWith("Selecione o tamanho")) {
            const example = text.substring("Selecione o tamanho".length).trim();
            return (
                <Text style={styles.dropdownPlaceholderText}>
                    {"Selecione o\ntamanho\n" + example}
                </Text>
            );
        }
        return <Text style={styles.dropdownPlaceholderText}>{text}</Text>;
    };

    return (
        <Card style={styles.card}>
            <View style={styles.cardIconContainer}>
                <Text style={styles.cardEmoji}>{emoji}</Text>
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <View style={styles.dropdownContainer}>
                <View style={styles.dropdownVisual}>
                    <View style={styles.dropdownTextWrapper}>
                        {selectedValue ? (
                            <Text style={styles.dropdownValueText}>{selectedValue}</Text>
                        ) : (
                            renderPlaceholderText(placeholder)
                        )}
                    </View>
                    <Feather name="chevron-down" size={14} color={theme.colors.textLight} style={styles.chevron} />
                </View>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={styles.picker}
                    mode="dropdown"
                >
                    <Picker.Item label={placeholder} value="" />
                    {options.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                    ))}
                </Picker>
            </View>
        </Card>
    );
};

export const MeuPerfilScreen = () => {
    const {
        bio,
        setBio,
        camisa,
        setCamisa,
        calca,
        setCalca,
        calcado,
        setCalcado,
        interesses,
        novoInteresse,
        setNovoInteresse,
        handleAddInteresse,
        handleRemoveInteresse,
        isSaving,
        successMessage,
        errorMessage,
        handleSalvar,
        clearMessages,
    } = useMeuPerfilViewModel();

    const opacityAnim = useRef(new Animated.Value(0)).current;
    const [bioHeight, setBioHeight] = useState(24);

    useEffect(() => {
        if (errorMessage) {
            opacityAnim.setValue(1);
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    clearMessages();
                }
            });
        }
    }, [errorMessage, clearMessages, opacityAnim]);

    const handleDismiss = () => {
        opacityAnim.setValue(0);
        clearMessages();
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle="Meu Perfil" showBackButton={false} showSettingsIcon={true} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 64}
            >
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    {errorMessage ? (
                        <Animated.View style={{ opacity: opacityAnim }}>
                            <Pressable onPress={handleDismiss} testID="error-toast">
                                <View style={styles.errorBanner}>
                                    <Feather name="alert-triangle" size={16} color={theme.colors.danger} style={{ marginRight: 8 }} />
                                    <Text style={styles.errorBannerText} testID="error-message">{errorMessage}</Text>
                                </View>
                            </Pressable>
                        </Animated.View>
                    ) : null}

                    <Text style={[styles.sectionTitle, styles.firstSectionTitle]}>Conte-nos sobre você:</Text>
                    <Card style={styles.bioCard}>
                        <Input
                            label=""
                            placeholder="Diga-nos um pouco sobre quem você é..."
                            placeholderTextColor={theme.colors.textLight}
                            value={bio}
                            onChangeText={setBio}
                            maxLength={1000}
                            multiline
                            onContentSizeChange={(e) => {
                                const height = e.nativeEvent.contentSize.height;
                                if (height > 0) {
                                    setBioHeight(height);
                                }
                            }}
                            style={{
                                borderWidth: 0,
                                backgroundColor: 'transparent',
                                padding: 0,
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingVertical: 0,
                                height: Math.min(Math.max(24, bioHeight), 72),
                                textAlignVertical: 'top',
                            }}
                            containerStyle={{ marginBottom: 0 }}
                        />
                    </Card>

                    <Text style={styles.sectionTitle}>Preferências de Estilo & Tamanho</Text>

                    <View style={styles.sizesRow}>
                        <SizeCard
                            title="Tamanho de Camisa"
                            emoji="👕"
                            placeholder="Selecione o tamanho (ex: P, M, G)"
                            selectedValue={camisa}
                            onValueChange={setCamisa}
                            options={['2 anos', '4 anos', '6 anos', '8 anos', '10 anos', '12 anos', '14 anos', '16 anos', 'PP', 'P', 'M', 'G', 'GG', 'XGG', 'G1', 'G2', 'G3', 'G4', 'G5']}
                        />

                        <SizeCard
                            title="Tamanho de Calça"
                            emoji="👖"
                            placeholder="Selecione o tamanho (ex: 38, 40, 42)"
                            selectedValue={calca}
                            onValueChange={setCalca}
                            options={['2 anos', '4 anos', '6 anos', '8 anos', '10 anos', '12 anos', '14 anos', '16 anos', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60']}
                        />

                        <SizeCard
                            title="Tamanho de Calçado"
                            emoji="👟"
                            placeholder="Selecione o tamanho (ex: 39, 40, 41)"
                            selectedValue={calcado}
                            onValueChange={setCalcado}
                            options={['16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48']}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Adicione seus interesses:</Text>
                    <Card style={styles.interestsCard}>
                        <View style={styles.interestsContainer}>
                            {interesses.map((item) => (
                                <Tag
                                    key={item}
                                    label={item}
                                    onRemove={() => handleRemoveInteresse(item)}
                                />
                            ))}
                        </View>
                        <View style={styles.addInterestRow}>
                            <Input
                                label=""
                                placeholder="Adicionar interesse..."
                                placeholderTextColor={theme.colors.textLight}
                                value={novoInteresse}
                                onChangeText={setNovoInteresse}
                                onSubmitEditing={handleAddInteresse}
                                style={{ borderWidth: 0, backgroundColor: 'transparent', padding: 0 }}
                                containerStyle={{ flex: 1, marginBottom: 0 }}
                                testID="interest-input"
                            />
                            <Pressable onPress={handleAddInteresse} style={styles.addChipButton} testID="add-chip-btn">
                                <Text style={styles.addChipText}>Adicionar</Text>
                                <Feather name="plus" size={14} color={theme.colors.text} />
                            </Pressable>
                        </View>
                    </Card>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title="Salvar Alterações"
                        onPress={handleSalvar}
                        isLoading={isSaving}
                    />
                </View>
            </KeyboardAvoidingView>
            <AppFooter />

            <PopupModal
                visible={!!successMessage}
                title="Sucesso!"
                message={successMessage}
                cancelText="Fechar"
                confirmText="OK"
                onCancel={handleDismiss}
                onConfirm={handleDismiss}
            />

            {errorMessage ? (
                <Pressable
                    style={styles.backdrop}
                    onPress={handleDismiss}
                    testID="message-backdrop"
                />
            ) : null}
        </SafeAreaView>
    );
};
