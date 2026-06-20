import {Entry} from "@core/interfaces/Entry";
import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {loadFile} from "@core/admin/helpers/fileLoader";

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

    async getById(collection: string, entry: string): Promise<Entry> {
        const fileContents = await loadFile(path.join(this.baseDir, collection, `${entry}.json`));
        if (!fileContents) { throw new Error(`Block ${entry} could not be found.`) }

        return JSON.parse(fileContents);
    };

    async create(collection: string, entry: Entry): Promise<Entry> {
        await fs.writeJson(path.join(this.baseDir, collection, `${entry.id}.json`), entry, { spaces: 2 });


        return entry;
    };

    async edit(collection: string, entry: Entry): Promise<Entry> {
        const initialEntry = await this.getById(collection, entry.slug);
        const editedEntry = { ...initialEntry, ...entry }
        await fs.writeJson(path.join(this.baseDir, collection, `${entry.slug}.json`), editedEntry, { spaces: 2 });

        return entry;
    };
}

export default new EntryService();
