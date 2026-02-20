// services/redirectService.ts
import { promises as fs } from 'fs';
import path from 'path';
import {SanitizedString} from "../manager/classes/sanitizedString";

class RedirectService {
    private basePath = path.join(process.cwd(), 'content');

    async getById<T = unknown>(collection: string, id: string): Promise<T> {
        collection = new SanitizedString(collection).toString();
        id = new SanitizedString(id).toString();

        const filePath = path.join(this.basePath, collection, `${id}.json`);

        try {
            const file = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(file) as T;
        } catch (error) {
            throw new Error(
                `Failed to load ${collection}/${id}.json: ${(error as Error).message}`
            );
        }
    }
}

export const redirectService = new RedirectService();
