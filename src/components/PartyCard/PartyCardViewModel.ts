import React from "react";
import { theme } from "../../styles/theme";
import { PartyStatus } from "../../types/Party";
import { formatDate } from "../../utils/Formatting/formatDate";

export interface Props {
    name: string;
    adminName: string;
    status: PartyStatus;
    eventDate: string;
    showDelete?: boolean;
    onDeletePress?: () => void;
    onPress?: () => void;
}

export function usePartyCardViewModel(props: Props) {
    return React.useMemo(() => {
        let config;
        let statusLabelStr = "";
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(props.eventDate + "T00:00:00");
        const isPastDate = eventDate.getTime() < today.getTime();
        
        let displayStatus = props.status as string;
        if (isPastDate && props.status !== 'sorteio_realizado' && props.status !== 'sorteio_revelado') {
            displayStatus = "cancelado";
        }
        
        switch (displayStatus) {
            case "sorteio_revelado":
                config = { icon: "check-circle" as const, color: theme.colors.success };
                statusLabelStr = "Encerrado e Revelado";
                break;
            case "sorteio_realizado":
                config = { icon: "gift" as const, color: theme.colors.success };
                statusLabelStr = "Sorteio Realizado";
                break;
            case "aguardando_sorteio":
                config = { icon: "clock" as const, color: theme.colors.textLight };
                statusLabelStr = "Aguardando Sorteio";
                break;
            case "aguardando_pessoas":
                config = { icon: "users" as const, color: theme.colors.primary };
                statusLabelStr = "Aguardando Pessoas";
                break;
            case "cancelado":
                config = { icon: "x" as const, color: theme.colors.danger };
                statusLabelStr = "Cancelado";
                break;
            default:
                config = { icon: "clock" as const, color: theme.colors.primary };
                statusLabelStr = displayStatus;
                break;
        }

        return {
            title: props.name,
            ownerLabel: `Dono: ${props.adminName}`,
            statusLabel: statusLabelStr,
            eventDate: `Evento: ${formatDate(props.eventDate)}`,
            statusIcon: config.icon,
            tagColor: config.color,
            onPress: props.onPress,
            showDelete: props.showDelete,
            onDeletePress: props.onDeletePress,
        };
    }, [props.name, props.status, props.eventDate, props.onPress, props.adminName, props.showDelete, props.onDeletePress]); 
};