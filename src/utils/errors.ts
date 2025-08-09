// src/utils/errors.ts

export const ERROR_CODES = {
    // Most common / generic
    TEP000: 'An unknown error occurred',
    TEP001: 'Invalid username or password',
    TEP002: 'Required fields are missing',
    TEP003: 'Something went wrong while creating a new user',

    // Less common / specific
    TEP100: 'User with that username already exists',
    TEP101: 'User with that email already exists',
    TEP102: 'User with that email/username combination already exists',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export function getErrorMessage(code: ErrorCode | string): string {
    return ERROR_CODES[code as ErrorCode] || ERROR_CODES.TEP000;
}
