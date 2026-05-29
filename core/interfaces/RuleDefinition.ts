import {RuleFunction} from "@core/interfaces/RuleFunction";

export interface RuleDefinition {
    fn: RuleFunction;
    defaultMessage: string;
}