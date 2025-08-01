import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';

const USERS_DIR = path.join(process.cwd(), 'content/users');

export interface User {
  username: string;
  passwordHash: string;
  role: string;
  email?: string;
}

let users: User[] = [];

export async function loadUsers() {
  const files = await fs.readdir(USERS_DIR);
  const loadedUsers: User[] = [];

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const filePath = path.join(USERS_DIR, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const user = JSON.parse(raw) as User;
    loadedUsers.push(user);
  }

  users = loadedUsers;
}

export function findUser(username: string): User | undefined {
  return users.find(u => u.username === username);
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}
