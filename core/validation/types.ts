// src/validation/types.ts

export type RuleFunction = (value: any, params?: string[]) => boolean;

export interface RuleDefinition {
    fn: RuleFunction;
    defaultMessage: string;
}

export interface ValidationRules {
    [field: string]: string | string[];
}

export interface CustomMessages {
    [field: string]: {
        [rule: string]: string;
    };
}
