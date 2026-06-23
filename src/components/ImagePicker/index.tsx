import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { createStyles } from './styles';
import { useImagePickerViewModel, Props } from './ImagePickerViewModel';
import { useAppTheme } from "../../contexts/ThemeContext";

export const ImagePicker = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { 
        label,
        value,
        containerStyle,
        handlePickImage,
    } = useImagePickerViewModel(props);
    
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={handlePickImage}
            >
            {value ? (
                <Image
                    source={{ uri: value }}
                    style={styles.image}
                />
            ) : (
                <Text style={styles.placeholder}>Selecionar Foto</Text>
            )}
            </TouchableOpacity>
        </View>
    );
}