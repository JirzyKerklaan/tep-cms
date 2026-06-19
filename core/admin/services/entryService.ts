import {Entry} from "@core/interfaces/Entry";
import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';

const DIR = path.join(process.cwd(), 'src', 'content', 'collections');
fs.ensureDirSync(DIR);

export class EntryService extends Service<Entry> {
    constructor() {
        super(DIR);
    }

    async getAll(subDir: string|null = null): Promise<string[]> {
        const DIR = subDir
            ? path.join(this.baseDir, subDir)
            : this.baseDir;

        let files = await fs.readdir(DIR);
        const results: string[] = [];

        files = files.filter(file => !file.startsWith('.'));

        for (const file of files) {
            if (file.startsWith('.')) {
                continue;
            }

            const stat = await fs.stat(path.join(DIR, file));

            if (stat.isFile() && path.extname(file) === '.json') {
                const filename = path.parse(file).name
                results.push(filename);
            }
        }
        return results;
    };

    async getById(collection: string, entry: string): Promise<Entry> {
        const fileContents = await fs.promises.readFile(
            path.join(this.baseDir, collection, `${entry}.json`),
            'utf-8'
        )
        if (!fileContents) { throw new Error(`Block ${entry} could not be found.`) }

        return JSON.parse(fileContents);
    };

    async create(collection: string, entry: Entry): Promise<Entry> {
        await fs.writeJson(path.join(this.baseDir, collection, `${entry.slug}.json`), entry, { spaces: 2 });

        return entry;
    };

    async edit(collection: string, entry: Entry): Promise<Entry> {
        await fs.writeJson(path.join(this.baseDir, collection, `${entry.slug}.json`), entry, { spaces: 2 });

        return entry;
    };
}

export default new EntryService();
