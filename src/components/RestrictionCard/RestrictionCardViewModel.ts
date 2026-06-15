import { RestrictionDirection } from "../../types/DrawRestriction";

export interface Props {
    personAName: string;
    personBName: string;
    restrictionDirection: RestrictionDirection;
    onPress: () => void;
}

export const useRestrictionCardViewModel = ({ personAName, personBName, restrictionDirection, onPress }: Props) => {
    return {
        personAName,
        personBName,
        restrictionDirection,
        onPress,
    };
};