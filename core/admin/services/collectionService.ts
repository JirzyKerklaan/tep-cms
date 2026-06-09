import { Service } from '@core/admin/services/service';
import fs from 'fs-extra';
import path from 'path';
import {Collection} from "@core/interfaces/Collection";

const COLLECTIONS_DIR = path.join(process.cwd(), 'src', 'content', 'collections');
const SCHEMAS_DIR = path.join(process.cwd(), 'src', 'content', 'schemas', 'collections');

fs.ensureDirSync(COLLECTIONS_DIR);
fs.ensureDirSync(SCHEMAS_DIR);

class CollectionService extends Service<Collection> {
    constructor() {
        super(COLLECTIONS_DIR);
    }

    create = async (collection: Collection): Promise<boolean> => {
        try {
            const schema = {
                name: collection.name,
                blocks: collection.blocks,
                created_at: new Date().toISOString()
            }

            const schemaPath = path.join(SCHEMAS_DIR, `${collection.name}.schema.json`);
            await fs.outputJson(schemaPath, schema, { spaces: 2 });

            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    };

    getAllWithEntryCount = async (): Promise<{ name: string; count: number }[]> => {
        const collections = await fs.readdir(COLLECTIONS_DIR);
        const results: { name: string; count: number }[] = [];

        for (const folderName of collections) {
            const folderPath = path.join(COLLECTIONS_DIR, folderName);
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
