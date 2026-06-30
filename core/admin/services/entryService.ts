import {Entry} from "@core/interfaces/Entry";
import {Service} from "@core/admin/services/service";
import path from 'path';
import {contentRegistry} from "@core/content/contentRegistry";

const DIR = path.join(process.cwd(), 'src', 'content', 'collections');

export class EntryService extends Service {
    constructor() {
        super(DIR);
    }

    async getAll(collection?: string): Promise<Entry[]> {
        const dir = collection
            ? this.resolve(collection)
            : this.baseDir;

        const files = await this.listFiles(dir, ".json");

        return Promise.all(
            files.map(file =>
                this.readJson<Entry>(path.join(dir, file))
            )
        );
    }

    async getById(collection: string, entrySlug: string): Promise<Entry> {
        const id = contentRegistry.getBySlug(entrySlug);

        return this.readJson<Entry>(this.resolve(collection, `${id}.json`));
    };

    async create(collection: string, entry: Entry): Promise<Entry> {
        await this.writeJson(this.resolve(collection, `${entry.id}.json`), entry);

        return entry;
    }

    async edit(collection: string, entry: Entry): Promise<Entry> {
        const entryToFind = contentRegistry.getById(entry.id);

        const current = await this.getById(collection, entryToFind);

        const edited = {...current, ...entry};

        await this.writeJson(this.resolve(collection, `${entry.id}.json`), edited);

        return edited;
    }

    async delete(collection: string, entrySlug: string): Promise<void> {
        const id = contentRegistry.getBySlug(entrySlug);

        await this.remove(this.resolve(collection, `${id}.json`));
    }
}

export default new EntryService();
