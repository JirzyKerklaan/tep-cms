import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {Block} from "@core/interfaces/Block";

const DIR = path.join(process.cwd(), 'src', 'content', 'blocks');
fs.ensureDirSync(DIR);

export class BlockService extends Service<Block> {
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
}

export default new BlockService();
