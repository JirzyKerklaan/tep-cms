import fs from 'fs-extra';
import path from 'path';
import { Service } from './service';
import { Entry } from '../../interfaces/Entry';
import {Collection} from "../../interfaces/Collection";

const COLLECTIONS_DIR = path.join(process.cwd(), 'content', 'collections');

fs.ensureDirSync(COLLECTIONS_DIR);

class EntryService extends Service<Entry> {
    constructor() {
        super(COLLECTIONS_DIR);
    }

    saveEntry = async (collectionName: string, data: Entry): Promise<Entry> => {
        const slug = data.slug ?? data.name.toLowerCase().replace(/\s+/g, '-');

        const entryData: Entry = {
            id: '',
            title: data.name,
            slug: slug,
            published_at: new Date(),
            scheduled_at: null,
            page_builder: [],
        };

        const filePath = path.join(this.baseDir, collectionName, `${slug}.json`);
        await fs.outputJson(filePath, entryData, { spaces: 2 });

        return entryData;
    };

    getById = async (collectionName: string, id: string): Promise<Entry | null> => {
        const file = path.join(this.baseDir, collectionName, `${id}.json`);
        if (!(await fs.pathExists(file))) return null;
        return fs.readJson(file) as Promise<Entry>;
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
