// src/utils/errors.ts

export const ERROR_CODES = {
    // ===============================
    // 1xx — Authentication & Registration
    // ===============================

    // 11x — Authentication
    TEP110: 'General authentication error',
    TEP111: 'Invalid username or password',
    TEP112: 'Account locked or suspended',
    TEP113: 'Too many failed login attempts',
    TEP114: 'Session expired or invalid',

    // 12x — Registration
    TEP120: 'General registration error',
    TEP121: 'Email already registered',
    TEP122: 'Username already taken',
    TEP123: 'Invalid email format',
    TEP124: 'Password too weak',
    TEP125: 'Missing required fields',

    // ===============================
    // 2xx — Success Messages
    // ===============================
    TEP200: null,
    TEP210: 'Login successful',
    TEP211: 'Logout successful',
    TEP220: 'Registration successful',

    // ===============================
    // 3xx — Rate Limiting / Security
    // ===============================
    TEP300: 'General security warning',
    TEP310: 'Too many requests',
    TEP311: 'Too many failed login attempts (temporary block)',
    TEP320: 'IP blocked',
    TEP330: 'Suspicious activity detected',
    TEP340: 'Captcha required',

    // ===============================
    // 4xx — Common / Generic Errors
    // ===============================
    TEP400: 'General client error',
    TEP410: 'Resource not found',
    TEP411: 'Page not found',
    TEP420: 'Method not allowed',
    TEP430: 'Unsupported media type',
    TEP431: 'Conversion to WEBP failed',
    TEP440: 'Invalid request format',
    TEP450: 'Internal server error',
    TEP451: 'Service temporarily unavailable',
    TEP460: 'Failed to fetch collections',
    TEP461: 'Collection could not be found',
    TEP462: 'Failed to update collection',
    TEP463: 'Failed to delete collection',
    TEP464: 'Collection already exists',
    TEP465: 'Collection name is required',
    TEP470: 'Failed to fetch blocks',
    TEP471: 'Block could not be found',
    TEP472: 'Failed to update block',
    TEP473: 'Failed to delete block',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export function getErrorMessage(code: ErrorCode | string): string {
    return ERROR_CODES[code as ErrorCode] || ERROR_CODES.TEP400;
}
