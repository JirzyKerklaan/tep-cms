import { Validator } from '../../core/validation';

export abstract class BaseRequest<T extends Record<string, unknown>> {
    protected data!: T;
    protected errors: Record<string, string[]> = {};

    abstract rules(): Record<keyof T, string | string[]>;

    messages(): Record<string, Record<string, string>> {
        return {};
    }

    validate(raw: T): void {
        const validator = new Validator<T>(raw, this.rules(), this.messages());

        if (!validator.passes()) {
            this.errors = validator.errors;
            throw { validation: this.errors };
        }

        this.data = raw;
    }

    validated<K extends keyof T>(field?: K): T[K] | T {
        if (field) return this.data[field];
        return this.data;
    }
}