import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { useImagePickerViewModel, Props } from './ImagePickerViewModel';

export const ImagePicker = (props: Props) => {
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