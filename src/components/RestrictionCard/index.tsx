import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRestrictionCardViewModel, Props } from "./RestrictionCardViewModel";
import { createStyles } from "./styles";
import { useAppTheme } from "../../contexts/ThemeContext";

export const RestrictionCard = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { personAName, personBName, restrictionDirection, onPress } = useRestrictionCardViewModel(props);

    return (
        <View style={styles.container}>
            <View style={styles.text}>
                <Text style={{ color: theme.colors.text }}>{personAName}</Text>
                    {restrictionDirection === "both_ways" && (
                        <Feather
                            name="arrow-left"
                            size={20}
                            color={theme.colors.textLight}
                        />
                    )}
                    <Feather
                        name="arrow-right"
                        size={20}
                        color={theme.colors.textLight}
                    />
                <Text style={{ color: theme.colors.text }}>{personBName}</Text>
            </View>

            <TouchableOpacity onPress={onPress} testID="close-button">
                <Feather
                    name="x"
                    size={20}
                    color={theme.colors.danger}
                />
            </TouchableOpacity>
        </View>
    );
};