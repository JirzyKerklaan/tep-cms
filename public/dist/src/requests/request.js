"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRequest = void 0;
const validation_1 = require("../../core/validation");
class BaseRequest {
    constructor() {
        this.errors = {};
    }
    messages() {
        return {};
    }
    validate(raw) {
        const validator = new validation_1.Validator(raw, this.rules(), this.messages());
        if (!validator.passes()) {
            this.errors = validator.errors;
            throw { validation: this.errors };
        }
        this.data = raw;
    }
    validated(field) {
        if (field)
            return this.data[field];
        return this.data;
    }
}
exports.BaseRequest = BaseRequest;
