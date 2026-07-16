export class ValidationError extends Error {
    constructor(
        public readonly validation: Record<string, string[]>
    ) {
        super('Validation failed');
        this.name = 'ValidationError';
    }
}