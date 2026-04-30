import React from "react";
import { theme } from "../../styles/theme";
import { PartyStatus } from "../../types/Party";

export interface Props {
    name: string;
    status: PartyStatus;
    eventDate: string;
    onPress?: () => void;
}

export const usePartyCardViewModel = (props: Props) => {
    return React.useMemo(() => {
        let config;
        
        switch (props.status) {
            case "Sorteio Realizado":
                config = { icon: "gift" as const, color: theme.colors.success };
                break;
            case "Fim do evento":
                config = { icon: "check-circle" as const, color: theme.colors.textLight };
                break;
            default:
                config = { icon: "clock" as const, color: theme.colors.primary };
                break;
        }

        return {
            title: props.name,
            statusLabel: props.status,
            eventDate: `Evento: ${props.eventDate}`,
            statusIcon: config.icon,
            tagColor: config.color,
            onPress: props.onPress,
        };
    }, [props.name, props.status, props.eventDate, props.onPress]); 
};