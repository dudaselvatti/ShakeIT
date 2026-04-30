import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Tag } from "../../components/Tag";
import { theme } from "../../styles/theme";
import { styles } from "./styles";
import { usePartyCardViewModel, Props } from "./PartyCardViewModel";

export const PartyCard = (props: Props) => {
    const { title, statusLabel, eventDate, statusIcon, tagColor, onPress } = usePartyCardViewModel(props);
    
    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Feather name={statusIcon} size={20} color={theme.colors.primary} testID="party-card-icon"/>
            </View>

            <View style={styles.cardInfoRow}>
                <Feather name="calendar" size={14} color={theme.colors.textLight} />
                <Text style={styles.cardInfoText}>{eventDate}</Text>
            </View>

            <View style={styles.cardFooter}>
                <Tag label={statusLabel} color={tagColor} />
            </View>
        </TouchableOpacity> 
    );
};