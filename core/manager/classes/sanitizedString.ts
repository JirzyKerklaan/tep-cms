export class SanitizedString {
    readonly value: string;

    constructor(input: string) {
        // sanitize immediately
        this.value = input.replace(/[^a-zA-Z0-9-_]/g, '');
    }

    toString() {
        return this.value;
    }
}
