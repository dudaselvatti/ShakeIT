import { ViewStyle } from "react-native";
import * as ImagePicker from "expo-image-picker";

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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.1, // Compressão pesada para salvar no banco
            base64: true, // Adicionado para retornar a string em base64
        });
        
        if (!result.canceled && result.assets[0].base64) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            onChangeImage(base64Image);
        }
    };

    return {
        label,
        value,
        containerStyle,
        handlePickImage,
    };
};