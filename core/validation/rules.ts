// src/validation/rules.ts
import { RuleDefinition } from './types';

export const ruleRegistry: Record<string, RuleDefinition> = {
    required: {
        fn: (value) => value !== undefined && value !== null && value !== "",
        defaultMessage: "The :field field is required."
    },
    string: {
        fn: (value) => typeof value === "string",
        defaultMessage: "The :field must be a string."
    },
    number: {
        fn: (value) => typeof value === "number",
        defaultMessage: "The :field must be a number."
    },
    email: {
        fn: (value) => typeof value === "string" && /^\S+@\S+\.\S+$/.test(value),
        defaultMessage: "The :field must be a valid email."
    },
    min: {
        fn: (value, params) => {
            if (typeof value === "string") return value.length >= Number(params?.[0]);
            if (typeof value === "number") return value >= Number(params?.[0]);
            return false;
        },
        defaultMessage: "The :field must be at least :param characters."
    },
    max: {
        fn: (value, params) => {
            if (typeof value === "string") return value.length <= Number(params?.[0]);
            if (typeof value === "number") return value <= Number(params?.[0]);
            return false;
        },
        defaultMessage: "The :field may not be greater than :param."
    }
};
