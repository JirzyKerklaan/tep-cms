import {Service} from "@core/admin/services/service";
import path from 'path';
import {Collection} from "@core/interfaces/Collection";
import standardPage from "@core/definitions/standardPage";
import blockService from "@core/admin/services/blockService";
import {v4 as uuidv4} from "uuid";

const DIR = path.join(process.cwd(), 'src', 'content', 'collections');

export class CollectionService extends Service {
    constructor() {
        super(DIR);
    }

    async getAll(): Promise<string[]> {
        const files = await this.listFiles(this.baseDir);
        return files.map(file => path.parse(file).name);
    }

    async getById(collection: string): Promise<Collection> {
        return this.readJson<Collection>(this.resolveSchema('collections', `${collection}.schema.json`));
    }

    async create(collection: Collection): Promise<Collection> {
        const schemaPath = this.resolveSchema('collections', `${collection.slug}.schema.json`)

        if (await this.exists(schemaPath)) {
            throw new Error(`Collection '${collection.name}' already exists`);
        }

        const uuid = uuidv4();

        collection.blocks = await Promise.all(
            collection.blocks.map(slug =>
                blockService.getById(slug, "page_builder")
            )
        );

        await this.writeJson(schemaPath, collection);

        await this.writeJson(this.resolve(collection.name, `${uuid}.json`), standardPage(collection, uuid));

        return collection;
    }

    async edit(collection: Collection): Promise<Collection> {
        const current = await this.getById(collection.slug)

        const edited = {...current, ...collection};

        await this.writeJson(this.resolveSchema('collections', `${collection.slug}.schema.json`), edited);

        return collection;
    }

    async delete(collection: string): Promise<void> {
        await this.remove(this.resolve(collection));
        await this.remove(this.resolveSchema('collections', `${collection}.schema.json`));
    }
}

export default new CollectionService();
