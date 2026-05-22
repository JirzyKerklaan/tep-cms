"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const rules_1 = require("./rules");
class Validator {
    constructor(data, rules, messages = {}) {
        this.errors = {};
        this.data = data;
        this.rules = rules;
        this.messages = messages;
    }
    passes() {
        this.errors = {};
        for (const field in this.rules) {
            const value = this.data[field];
            const fieldRules = Array.isArray(this.rules[field])
                ? this.rules[field]
                : this.rules[field].split("|");
            for (const ruleString of fieldRules) {
                const [ruleName, ...params] = ruleString.split(":");
                const rule = rules_1.ruleRegistry[ruleName];
                if (!rule)
                    continue;
                if (!rule.fn(value, params)) {
                    let message = this.messages[field]?.[ruleName] || rule.defaultMessage;
                    message = message
                        .replace(":field", field)
                        .replace(":param", params[0] || "");
                    if (!this.errors[field])
                        this.errors[field] = [];
                    this.errors[field].push(message);
                }
            }
        }
        return Object.keys(this.errors).length === 0;
    }
}
exports.Validator = Validator;
