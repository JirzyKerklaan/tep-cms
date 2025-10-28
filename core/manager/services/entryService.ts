import fs from 'fs-extra';
import path from 'path';
import { Service } from './service';
import { Entry } from '../../interfaces/Entry';

const COLLECTIONS_DIR = path.join(process.cwd(), 'content', 'collections');

fs.ensureDirSync(COLLECTIONS_DIR);

class EntryService extends Service<Entry> {
    constructor() {
        super(COLLECTIONS_DIR);
    }

    async getAllFromCollection(collectionName: string): Promise<Entry[]> {
        const collectionPath = path.join(this.baseDir, collectionName);

        if (!(await fs.pathExists(collectionPath))) return [];

        const files = await fs.readdir(collectionPath);
        const results: Entry[] = [];

        for (const file of files) {
            if (file.endsWith('.json')) {
                const entity = await fs.readJson(path.join(collectionPath, file)) as Entry;
                results.push(entity);
            }
        }

        return results;
    };

    async cronUpdate(collectionName: string, entrySlug: string, data: Partial<Entry>): Promise<void> {
        const filePath = path.join(this.baseDir, collectionName, `${entrySlug}.json`);


        if (!(await fs.pathExists(filePath))) {
            throw new Error(`Entry "${entrySlug}" not found in collection "${collectionName}"`);
        }

        const existing: Entry = await fs.readJson(filePath);
        const updated: Entry = { ...existing, ...data };
        await fs.writeJson(filePath, updated, { spaces: 2 });
    }

}

export default new EntryService();
