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
            quality: 0.1, // Compressão pesada para salvar espaço no Firebase
        });
        
        if (!result.canceled) {
            onChangeImage(result.assets[0].uri);
        }
    };

    return {
        label,
        value,
        containerStyle,
        handlePickImage,
    };
};