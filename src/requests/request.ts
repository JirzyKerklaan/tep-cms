// src/requests/BaseRequest.ts
import { Validator } from '../../core/validation';

export abstract class BaseRequest {
    protected data: Record<string, any> = {};
    protected errors: Record<string, string[]> = {};

    abstract rules(): Record<string, string | string[]>;

    messages(): Record<string, Record<string, string>> {
        return {};
    }

    validate(raw: any): void {
        this.data = raw;
        const validator = new Validator(this.data, this.rules(), this.messages());

        if (!validator.passes()) {
            this.errors = validator.errors;
            throw { validation: this.errors };
        }

        const validatedData: Record<string, any> = {};
        for (const key of Object.keys(this.rules())) {
            validatedData[key] = this.data[key];
        }

        Object.defineProperty(validatedData, 'validated', {
            value: (field?: string) => (field ? validatedData[field] : validatedData),
            enumerable: false,
        });

        this.data = validatedData;
    }
    validated(field?: string) {
        if (field) return this.data[field];
        return this.data;
    }
}
