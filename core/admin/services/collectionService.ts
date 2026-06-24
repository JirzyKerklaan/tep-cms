import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {Collection} from "@core/interfaces/Collection";
import standardPage from "@core/definitions/standardPage";
import {Block} from "@core/interfaces/Block";
import blockService from "@core/admin/services/blockService";
import slugify from "slugify";
import {Entry} from "@core/interfaces/Entry";
import {loadFile} from "@core/admin/helpers/fileLoader";
import {v4 as uuidv4} from "uuid";

const DIR = path.join(process.cwd(), 'src', 'content', 'collections');
fs.ensureDirSync(DIR);

export class CollectionService extends Service<Collection> {
    constructor() {
        super(DIR);
    }

    async getAll(): Promise<string[]> {
        const files = await fs.readdir(this.baseDir);

        return files
            .filter(file => !file.startsWith('.'))
            .map(file => path.parse(file).name);
    }

    async getById(collection: string): Promise<Entry> {
        const fileContents = await loadFile(path.join(this.contentDir, 'schemas', 'collections', `${collection}.schema.json`));
        if (!fileContents) { throw new Error(`Collection ${collection} could not be found.`) }

        return JSON.parse(fileContents);
    };

    async create(collection: Collection): Promise<Collection> {
        const collectionDir = path.join(this.baseDir, collection.name);
        const schemaPath = path.join(this.contentDir, 'schemas', 'collections', `${collection.slug}.schema.json`);
        const uuid = uuidv4()

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
        await fs.writeJson(path.join(collectionDir, `${uuid}.json`), standardPage(collection, uuid), { spaces: 2 }); // Create collection entry

        return collection;
    }

    async edit(collection: Collection): Promise<Collection> {
        return collection;
    }
}

export default new CollectionService();
