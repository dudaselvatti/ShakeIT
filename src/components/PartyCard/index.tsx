import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PixelIcon as Feather } from "../PixelIcon";
import { Tag } from "../../components/Tag";
import { theme } from "../../styles/theme";
import { createStyles } from "./styles";
import { usePartyCardViewModel, Props } from "./PartyCardViewModel";
import { useAppTheme } from "../../contexts/ThemeContext";

export const PartyCard = (props: Props) => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { title, ownerLabel, statusLabel, eventDate, statusIcon, tagColor, onPress } = usePartyCardViewModel(props);
    
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="calendar" size={14} color={theme.colors.textLight} />
                    <Text style={[styles.cardInfoText, { marginLeft: 6 }]}>{eventDate}</Text>
                </View>
                
                <View style={{ width: 16 }} />
                
                <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
                    <Feather name="user" size={14} color={theme.colors.textLight} />
                    <Text style={[styles.cardInfoText, { marginLeft: 6 }]} numberOfLines={1}>{ownerLabel}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Tag label={statusLabel} color={tagColor} />
            </View>
        </TouchableOpacity> 
    );
};