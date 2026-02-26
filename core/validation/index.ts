import {CustomMessages} from "../interfaces/CustomMessages";
import {ValidationRules} from "../interfaces/ValidationRules";
import { ruleRegistry } from "./rules";

export class Validator<T extends Record<string, unknown> = Record<string, unknown>> {
    private data: T;
    private rules: ValidationRules;
    private messages: CustomMessages;
    public errors: Record<string, string[]> = {};

    constructor(data: T, rules: ValidationRules, messages: CustomMessages = {}) {
        this.data = data;
        this.rules = rules;
        this.messages = messages;
    }

    public passes(): boolean {
        this.errors = {};

        for (const field in this.rules) {
            const value = this.data[field as keyof T];
            const fieldRules = Array.isArray(this.rules[field])
                ? this.rules[field]
                : this.rules[field].split("|");

            for (const ruleString of fieldRules) {
                const [ruleName, ...params] = ruleString.split(":");
                const rule = ruleRegistry[ruleName];
                if (!rule) continue;

                if (!rule.fn(value, params)) {
                    let message =
                        this.messages[field]?.[ruleName] || rule.defaultMessage;

                    message = message
                        .replace(":field", field)
                        .replace(":param", params[0] || "");

                    if (!this.errors[field]) this.errors[field] = [];
                    this.errors[field].push(message);
                }
            }
        }

        return Object.keys(this.errors).length === 0;
    }
}