import { ViewStyle } from "react-native";
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1, // Let ImageManipulator handle the compression
        });
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
            try {
                const manipResult = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 500, height: 500 } }],
                    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
                );
                
                if (manipResult.base64) {
                    const base64Image = `data:image/jpeg;base64,${manipResult.base64}`;
                    onChangeImage(base64Image);
                }
            } catch (error) {
                alert("Erro ao processar a imagem. Tente uma foto menor.");
                console.error(error);
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