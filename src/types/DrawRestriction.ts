export type RestrictionDirection =
  | "one_way"
  | "both_ways"

export interface DrawRestriction {
    id: string;
    party_id: string;
    person_a_id: string;
    person_b_id: string;
    direction: RestrictionDirection;
    created_at: string;
    updated_at: string;
}