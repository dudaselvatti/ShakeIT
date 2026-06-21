import { RestrictionDirection } from "../../types/DrawRestriction";

export interface DrawRestrictionCreationDTO {
    party_id: string;
    person_a_id: string;
    person_b_id: string;
    direction: RestrictionDirection;
}