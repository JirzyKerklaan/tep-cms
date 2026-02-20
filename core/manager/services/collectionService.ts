import { Service } from './service';
import fs from 'fs-extra';
import path from 'path';
import { ERROR_CODES } from '../../../src/utils/errors';
import {Collection} from "../../interfaces/Collection";
import {SanitizedString} from "../classes/sanitizedString";

const COLLECTIONS_DIR = path.join(process.cwd(), 'content', 'collections');
const SCHEMAS_DIR = path.join(process.cwd(), 'content', 'schemas', 'collections');

fs.ensureDirSync(COLLECTIONS_DIR);
fs.ensureDirSync(SCHEMAS_DIR);

class CollectionService extends Service<Collection> {
    constructor() {
        super(COLLECTIONS_DIR);
    }

    create = async (data: Partial<Collection>): Promise<Collection> => {
        if (!data.name) throw new Error(ERROR_CODES["TEP465"]);

        const id = Date.now().toString();
        const newCollection: Collection = { id, name: data.name };

        const name = new SanitizedString(newCollection.name).toString();

        await this.save(newCollection);

        const folderPath = path.join(COLLECTIONS_DIR, name);
        await fs.mkdir(folderPath, { recursive: true });

        const schemaContent = JSON.stringify({ schema: name }, null, 2);
        await fs.writeFile(path.join(SCHEMAS_DIR, `${name}.schema.json`), schemaContent, 'utf-8');

        const fileContent = JSON.stringify({ title: `First ${name}` }, null, 2);
        await fs.writeFile(path.join(folderPath, 'standard.json'), fileContent, 'utf-8');

        return newCollection;
    };


    getAllWithEntryCount = async (): Promise<{ name: string; count: number }[]> => {
        const collections = await fs.readdir(COLLECTIONS_DIR);
        const results: { name: string; count: number }[] = [];

        for (const folderName of collections) {
            const folderPath = path.join(COLLECTIONS_DIR, new SanitizedString(folderName).toString());
            const stat = await fs.stat(folderPath);
            if (stat.isDirectory()) {
                const files = await fs.readdir(folderPath);
                const jsonFiles = files.filter(f => f.endsWith('.json'));
                results.push({
                    name: folderName,
                    count: jsonFiles.length,
                });
            }
        }

        return results;
    };
}

export default new CollectionService();
