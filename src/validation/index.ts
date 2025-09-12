import {CustomMessages, ValidationRules} from "./types";
import {ruleRegistry} from "./rules";

export class Validator {
    private data: Record<string, any>;
    private rules: ValidationRules;
    private messages: CustomMessages;
    public errors: Record<string, string[]> = {};

    constructor(
        data: Record<string, any>,
        rules: ValidationRules,
        messages: CustomMessages = {}
    ) {
        this.data = data;
        this.rules = rules;
        this.messages = messages;
    }

    public passes(): boolean {
        this.errors = {};

        for (const field in this.rules) {
            const value = this.data[field];
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