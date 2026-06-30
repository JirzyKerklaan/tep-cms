import {RuleFunction} from "@core/interfaces/types/RuleFunction";

export interface RuleDefinition {
    fn: RuleFunction;
    defaultMessage: string;
}