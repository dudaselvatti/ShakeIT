import Toast from 'react-native-toast-message';
import { Alert, ViewStyle } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

export interface Props {
    label: string;
    value?: string;
    onChangeImage: (text: string) => void;
    containerStyle?: ViewStyle;
}

export function useImagePickerViewModel({ label, value, onChangeImage, containerStyle }: Props) {
    const handlePickImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permissionResult.granted) {
            alert("Permissão para acessar a galeria é necessária!");
            return;
        }
        
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.1, // Compressão agressiva direto na captura
            base64: true, // Pede o base64 direto para não precisar do ImageManipulator
        });
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const base64Data = result.assets[0].base64;
            if (base64Data) {
                const base64Image = `data:image/jpeg;base64,${base64Data}`;
                onChangeImage(base64Image);
            } else {
                Toast.show({ type: "error", text1: "Oops!", text2: "Erro ao carregar a imagem." });
            }
        }
    };

    return {
        label,
        value,
        containerStyle,
        handlePickImage,
    };
};