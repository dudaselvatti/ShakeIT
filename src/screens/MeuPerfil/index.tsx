import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Tag } from '../../components/Tag';
import { PopupModal } from '../../components/PopupModal';
import { createStyles } from './styles';
import { theme } from '../../styles/theme';
import { useMeuPerfilViewModel } from './MeuPerfilViewModel';
import { ImagePicker } from "../../components/ImagePicker";
import { SelectInput } from "../../components/SelectInput";
import { DateInput } from "../../components/DateInput";
import { calcularIdade } from '../../utils/Usuario/calcularIdade';
import { useAppTheme } from "../../contexts/ThemeContext";

interface SizeCardProps {
    title: string;
    imageSource: any;
    placeholder: string;
    selectedValue: string;
    onValueChange: (val: string) => void;
    options: string[];
    isEditing: boolean;
}

const SizeCard = ({ title, imageSource, placeholder, selectedValue, onValueChange, options, isEditing }: SizeCardProps) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const renderPlaceholderText = (text: string) => {
        if (!isEditing) return <Text style={styles.dropdownPlaceholderText}>-</Text>;
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
                <Image source={imageSource} style={{ width: 56, height: 56, resizeMode: 'contain' }} />
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
                    {isEditing && <Feather name="chevron-down" size={14} color={theme.colors.textLight} style={styles.chevron} />}
                </View>
                {isEditing && (
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
                )}
            </View>
        </Card>
    );
};

export const MeuPerfilScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const navigation = useNavigation<any>();
    const {
        nome,
        setNome,
        genero,
        setGenero,
        generoOptions,
        dataNascimento,
        setDataNascimento,
        avatarUrl,
        setAvatarUrl,
        bio,
        setBio,
        camisa,
        setCamisa,
        calca,
        setCalca,
        calcado,
        setCalcado,
        gostos,
        novoGosto,
        setNovoGosto,
        handleAddGosto,
        handleRemoveGosto,
        evitar,
        novoEvitar,
        setNovoEvitar,
        handleAddEvitar,
        handleRemoveEvitar,
        isSaving,
        successMessage,
        errorMessage,
        handleSalvar,
        clearMessages,
        isEditing,
        setIsEditing,
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
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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

                    {!isEditing ? (
                        <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 16 }}>
                            <Image source={avatarUrl ? { uri: avatarUrl } : require('../../../assets/perfil-padrao.png')} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }} />
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text }}>{nome}</Text>
                            <Text style={{ fontSize: 16, color: theme.colors.textLight, marginTop: 4 }}>
                                {genero} • {dataNascimento ? `${calcularIdade(dataNascimento.toISOString().split('T')[0])} anos` : 'Data de nascimento não informada'}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ marginBottom: 24, marginTop: 16 }}>
                            <ImagePicker
                                label="Foto de Perfil"
                                value={avatarUrl}
                                onChangeImage={setAvatarUrl}
                            />
                            <Input label="Nome" value={nome} onChangeText={setNome} maxLength={50} />
                            <SelectInput
                                label="Gênero"
                                selectedValue={genero}
                                onValueChange={setGenero}
                                options={generoOptions}
                            />
                            <DateInput
                                display="spinner"
                                label="Data de Nascimento"
                                value={dataNascimento}
                                onChangeDate={setDataNascimento}
                                maximumDate={new Date()}
                            />
                        </View>
                    )}

                    <Text style={[styles.sectionTitle, styles.firstSectionTitle]}>Conte-nos sobre você:</Text>
                    {isEditing ? (
                        <Input
                            label=""
                            placeholder="Diga-nos um pouco sobre quem você é..."
                            value={bio}
                            onChangeText={setBio}
                            maxLength={1000}
                            multiline
                            numberOfLines={4}
                            blurOnSubmit={true}
                            returnKeyType="done"
                        />
                    ) : (
                        <Card style={styles.bioCard}>
                            <Text style={{ color: theme.colors.text, minHeight: 24 }}>{bio || 'Nenhuma biografia adicionada.'}</Text>
                        </Card>
                    )}

                    <Text style={styles.sectionTitle}>Preferências de Estilo & Tamanho</Text>

                    <View style={styles.sizesRow}>
                        <SizeCard
                            title="Tamanho de Camisa"
                            imageSource={require('../../../assets/camisa.png')}
                            placeholder="Selecione o tamanho (ex: P, M, G)"
                            selectedValue={camisa}
                            onValueChange={setCamisa}
                            options={['2 anos', '4 anos', '6 anos', '8 anos', '10 anos', '12 anos', '14 anos', '16 anos', 'PP', 'P', 'M', 'G', 'GG', 'XGG', 'G1', 'G2', 'G3', 'G4', 'G5']}
                            isEditing={isEditing}
                        />

                        <SizeCard
                            title="Tamanho de Calça"
                            imageSource={require('../../../assets/calca.png')}
                            placeholder="Selecione o tamanho (ex: 38, 40, 42)"
                            selectedValue={calca}
                            onValueChange={setCalca}
                            options={['2 anos', '4 anos', '6 anos', '8 anos', '10 anos', '12 anos', '14 anos', '16 anos', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60']}
                            isEditing={isEditing}
                        />

                        <SizeCard
                            title="Tamanho de Calçado"
                            imageSource={require('../../../assets/tenis.png')}
                            placeholder="Selecione o tamanho (ex: 39, 40, 41)"
                            selectedValue={calcado}
                            onValueChange={setCalcado}
                            options={['16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48']}
                            isEditing={isEditing}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Coisas que você gosta:</Text>
                    <Card style={styles.interestsCard}>
                        <View style={styles.interestsContainer}>
                            {gostos.map((item) => (
                                <Tag
                                    key={item}
                                    label={item}
                                    onRemove={isEditing ? () => handleRemoveGosto(item) : undefined}
                                />
                            ))}
                            {!isEditing && gostos.length === 0 && (
                                <Text style={{ color: theme.colors.textLight }}>Nenhum item adicionado.</Text>
                            )}
                        </View>
                        {isEditing && (
                            <View style={styles.addInterestRow}>
                                <Input
                                    label=""
                                    placeholder="Gosto de... (pressione Enter)"
                                    value={novoGosto}
                                    onChangeText={setNovoGosto}
                                    onSubmitEditing={handleAddGosto}
                                    containerStyle={{ flex: 1, marginBottom: 0, marginRight: 8 }}
                                    testID="gostos-input"
                                />
                                <Button
                                    title="+"
                                    onPress={handleAddGosto}
                                    style={{ width: 48, height: 48 }}
                                />
                            </View>
                        )}
                    </Card>

                    <Text style={styles.sectionTitle}>Coisas para evitar:</Text>
                    <Card style={styles.interestsCard}>
                        <View style={styles.interestsContainer}>
                            {evitar.map((item) => (
                                <Tag
                                    key={item}
                                    label={item}
                                    onRemove={isEditing ? () => handleRemoveEvitar(item) : undefined}
                                />
                            ))}
                            {!isEditing && evitar.length === 0 && (
                                <Text style={{ color: theme.colors.textLight }}>Nenhum item adicionado.</Text>
                            )}
                        </View>
                        {isEditing && (
                            <View style={styles.addInterestRow}>
                                <Input
                                    label=""
                                    placeholder="Evitar... (pressione Enter)"
                                    value={novoEvitar}
                                    onChangeText={setNovoEvitar}
                                    onSubmitEditing={handleAddEvitar}
                                    containerStyle={{ flex: 1, marginBottom: 0, marginRight: 8 }}
                                    testID="evitar-input"
                                />
                                <Button
                                    title="+"
                                    onPress={handleAddEvitar}
                                    style={{ width: 48, height: 48 }}
                                />
                            </View>
                        )}
                    </Card>

                    <Text style={styles.sectionTitle}>Dependentes (Filhos / Pets)</Text>
                    <Card style={styles.interestsCard}>
                        <View style={{ paddingVertical: 8 }}>
                            <Button
                                title="Gerenciar Dependentes"
                                onPress={() => navigation.navigate("GestaoDependentes")}
                                variant="outline"
                                testID="btn-gerenciar-dependentes"
                            />
                        </View>
                    </Card>
                </ScrollView>

                <View style={styles.footer}>
                    {isEditing ? (
                        <>
                            <Button
                                title="Salvar Alterações"
                                onPress={handleSalvar}
                                isLoading={isSaving}
                            />
                            <Button
                                title="Cancelar"
                                onPress={() => setIsEditing(false)}
                                variant="outline"
                                style={{ marginTop: 16 }}
                            />
                        </>
                    ) : (
                        <Button
                            title="Editar Perfil"
                            onPress={() => setIsEditing(true)}
                        />
                    )}
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
