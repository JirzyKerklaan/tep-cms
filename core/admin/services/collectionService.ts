import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {Collection} from "@core/interfaces/Collection";
import standardPage from "@core/definitions/standardPage";
import {Block} from "@core/interfaces/Block";
import blockService from "@core/admin/services/blockService";
import slugify from "slugify";
import {Entry} from "@core/interfaces/Entry";

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

    async getById(collection: string): Promise<Entry> {
        const fileContents = await fs.promises.readFile(
            path.join(this.contentDir, 'schemas', 'collections', `${collection}.schema.json`),
            'utf-8'
        )
        if (!fileContents) { throw new Error(`Collection ${collection} could not be found.`) }

        return JSON.parse(fileContents);
    };

    async create(collection: Collection): Promise<Collection> {
        const collectionDir = path.join(this.baseDir, collection.name);
        const schemaPath = path.join(this.contentDir, 'schemas', 'collections', `${slugify(collection.name)}.schema.json`);


        const blocks: Block[] = []
        for (const blockSlug of collection.blocks) {
            const block = await blockService.getById(blockSlug, 'page_builder');
            blocks.push(block);
        }
        collection.blocks = blocks;

        if (await fs.pathExists(schemaPath)) {
            throw new Error(`Collection '${collection.name}' already exists`);
        }

        await fs.ensureDir(collectionDir);

        await fs.writeJson(schemaPath, collection, { spaces: 2 }); // Create collection schema
        await fs.writeJson(path.join(collectionDir, 'standard.json'), standardPage(collection), { spaces: 2 }); // Create collection entry

        return collection;
    }
}

export default new CollectionService();
