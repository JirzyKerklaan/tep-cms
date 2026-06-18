import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {Collection} from "@core/interfaces/Collection";
import standardPage from "@core/definitions/standardPage";

const DIR = path.join(process.cwd(), 'src', 'content', 'collections');
fs.ensureDirSync(DIR);

export class CollectionService extends Service<Collection> {
    constructor() {
        super(DIR);
    }

    async getAll(): Promise<string[]> {
        let files = await fs.readdir(this.baseDir);
        const results: string[] = [];

        files = files.filter(file => !file.startsWith('.'));

        for (const file of files) {
            results.push(path.parse(file).name);
        }

        return results;
    };

    async create(collection: Collection): Promise<Collection> {
        const collectionDir = path.join(this.baseDir, collection.name);
        const schemaPath = path.join(this.contentDir, 'schemas', 'collections', `${collection.name}.schema.json`);

        if (await fs.pathExists(schemaPath)) {
            throw new Error(`Collection '${collection.name}' already exists`);
        }

        await fs.ensureDir(collectionDir);

        await fs.writeJson(schemaPath, collection, { spaces: 2 });
        await fs.writeJson(path.join(collectionDir, 'standard.json'), standardPage(collection), { spaces: 2 });

        return collection;
    }
}

export default new CollectionService();
