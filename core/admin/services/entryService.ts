import {Entry} from "@core/interfaces/Entry";
import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {loadFile} from "@core/admin/helpers/fileLoader";
import {contentRegistry} from "@core/content/contentRegistry";

const DIR = path.join(process.cwd(), 'src', 'content', 'collections');
fs.ensureDirSync(DIR);

export class EntryService extends Service<Entry> {
    constructor() {
        super(DIR);
    }

    async getAll(subDir: string | null = null): Promise<Entry[]> {
        const DIR = subDir
            ? path.join(this.baseDir, subDir)
            : this.baseDir;

        let files = await fs.readdir(DIR);

        files = files.filter(file =>
            !file.startsWith('.') &&
            path.extname(file) === '.json'
        );

        const results: Entry[] = [];

        for (const file of files) {
            const fileContents = await loadFile(path.join(DIR, file));

            results.push(JSON.parse(fileContents));
        }

        return results;
    }

    async getById(collection: string, entry: string|undefined): Promise<Entry> {
        if (entry === undefined) {
            throw new Error(`Entry ${entry} could not be found`);
        }
        const id = contentRegistry.getBySlug(entry);
        console.log(id)
        console.log(path.join(this.baseDir, collection, `${id}.json`));
        return JSON.parse(await loadFile(path.join(this.baseDir, collection, `${id}.json`)));
    };

    async create(collection: string, entry: Entry): Promise<Entry> {
        await fs.writeJson(path.join(this.baseDir, collection, `${entry.id}.json`), entry, { spaces: 2 });

        return entry;
    };

    async edit(collection: string, entry: Entry): Promise<Entry> {
        const initialEntry = await this.getById(collection, contentRegistry.getById(entry.id));

        await fs.promises.rename(
            path.join(this.baseDir, collection, `${initialEntry.slug}.json`),
            path.join(this.baseDir, collection, `${entry.slug}.json`)
        );

        const editedEntry = { ...initialEntry, ...entry }
        await fs.writeJson(path.join(this.baseDir, collection, `${entry.slug}.json`), editedEntry, { spaces: 2 });

        return entry;
    };
}

export default new EntryService();
