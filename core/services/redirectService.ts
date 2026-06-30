import path from 'path';
import {loadFile} from "@core/admin/helpers/fileLoader";

class RedirectService {
    private basePath = path.join(process.cwd(), 'src', 'content');

    async getById<T = unknown>(collection: string, id: string): Promise<T> {
        try {
            const file = await loadFile(path.join(this.basePath, collection, `${id}.json`));
            return JSON.parse(file) as T;
        } catch (error) {
            throw new Error(
                `Failed to load ${collection}/${id}.json: ${(error as Error).message}`
            );
        }
    }
}

export const redirectService = new RedirectService();
