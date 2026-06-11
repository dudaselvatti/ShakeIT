import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRestrictionCardViewModel, Props } from "./RestrictionCardViewModel";
import { styles, iconColor } from "./styles";

export const RestrictionCard = (props: Props) => {
    const { personAName, personBName, restrictionDirection, onPress } = useRestrictionCardViewModel(props);

    return (
        <View style={styles.container}>
            <View style={styles.text}>
                <Text>{personAName}</Text>
                    {restrictionDirection === "both_ways" && (
                        <Feather
                            name="arrow-left"
                            size={16}
                            color={iconColor}
                        />
                    )}
                    <Feather
                        name="arrow-right"
                        size={20}
                        color={iconColor}
                    />
                <Text>{personBName}</Text>
            </View>

            <TouchableOpacity onPress={onPress}>
                <Feather
                    name="x"
                    size={20}
                    color={iconColor}
                />
            </TouchableOpacity>
        </View>
    );
};