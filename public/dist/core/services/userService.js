"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadUsers = loadUsers;
exports.findEmail = findEmail;
exports.findUsername = findUsername;
exports.verifyPassword = verifyPassword;
exports.createPassword = createPassword;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const USERS_DIR = path_1.default.join(process.cwd(), 'content/users');
let users = [];
async function loadUsers() {
    const files = await promises_1.default.readdir(USERS_DIR);
    const loadedUsers = [];
    for (const file of files) {
        if (!file.endsWith('.json'))
            continue;
        const filePath = path_1.default.join(USERS_DIR, file);
        const raw = await promises_1.default.readFile(filePath, 'utf8');
        const user = JSON.parse(raw);
        loadedUsers.push(user);
    }
    users = loadedUsers;
}
function findEmail(email) {
    return users.find(u => u.email === email);
}
function findUsername(username) {
    return users.find(u => u.username === username);
}
async function verifyPassword(user, password) {
    return bcrypt_1.default.compare(password, user.passwordHash);
}
async function createPassword(password) {
    return bcrypt_1.default.hash(password, 10);
}
