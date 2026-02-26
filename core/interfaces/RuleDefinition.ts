import {RuleFunction} from "./RuleFunction";

export interface RuleDefinition {
    fn: RuleFunction;
    defaultMessage: string;
}