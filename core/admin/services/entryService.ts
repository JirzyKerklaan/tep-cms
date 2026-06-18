import {Entry} from "@core/interfaces/Entry";
import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {Collection} from "@core/interfaces/Collection";
import standardPage from "@core/definitions/standardPage";

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

    async getById(collection: string, entry: string): Promise<Entry | null> {
        const file = path.join(this.baseDir, collection, `${entry}.json`);
        if (!(await fs.pathExists(file))) return null;
        return fs.readJson(file) as Promise<Entry>;
    };

    async create(collection: string, entry: Entry): Promise<Entry> {
        await fs.writeJson(path.join(this.baseDir, collection, `${entry.slug}.json`), entry, { spaces: 2 });

        return entry;
    };
}

export default new EntryService();
