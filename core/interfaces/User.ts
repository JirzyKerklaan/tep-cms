export interface User {
    username: string;
    passwordHash: string;
    role: string;
    email?: string;
}