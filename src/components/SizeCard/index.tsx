import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card } from '../Card';
import { PixelIcon as Feather } from '../PixelIcon';
import { useAppTheme } from '../../contexts/ThemeContext';

interface SizeCardProps {
    title: string;
    imageSource: any;
    placeholder: string;
    selectedValue: string;
    onValueChange: (val: string) => void;
    options: string[];
    isEditing: boolean;
}

export const SizeCard = ({ title, imageSource, placeholder, selectedValue, onValueChange, options, isEditing }: SizeCardProps) => {
    const { theme } = useAppTheme();
    
    const styles = StyleSheet.create({
        card: {
            flex: 1,
            marginHorizontal: 4,
            padding: 8,
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: 140,
        },
        cardIconContainer: {
            width: 56,
            height: 56,
            marginBottom: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardTitle: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.colors.textLight,
            marginBottom: 12,
            textAlign: 'center',
            minHeight: 32,
        },
        dropdownContainer: {
            width: '100%',
            position: 'relative',
        },
        dropdownVisual: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: isEditing ? 1 : 0,
            borderColor: theme.colors.border,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 6,
            backgroundColor: isEditing ? theme.colors.background : 'transparent',
            minHeight: 40,
        },
        dropdownTextWrapper: {
            flex: 1,
            justifyContent: 'center',
        },
        dropdownValueText: {
            fontSize: 14,
            color: theme.colors.text,
            fontWeight: '500',
            textAlign: 'center',
        },
        dropdownPlaceholderText: {
            fontSize: 12,
            color: theme.colors.textLight,
            textAlign: 'center',
            fontStyle: 'italic',
        },
        chevron: {
            marginLeft: 4,
        },
        picker: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
        },
    });

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
                <Image source={imageSource} style={{ width: 48, height: 48, resizeMode: 'contain' }} />
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
