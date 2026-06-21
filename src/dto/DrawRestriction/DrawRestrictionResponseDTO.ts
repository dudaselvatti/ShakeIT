import { RestrictionDirection } from "../../types/DrawRestriction";

export type DrawRestrictionResponseDTO = {
    id: string;
    party_id: string;
    person_a_id: string;
    person_b_id: string;
    direction: RestrictionDirection;
};