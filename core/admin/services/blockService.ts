import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {Block} from "@core/interfaces/Block";
import {BlockType} from "@core/interfaces/types/BlockType";

const DIR = path.join(process.cwd(), 'src', 'content', 'schemas');
fs.ensureDirSync(DIR);

export class BlockService extends Service<Block> {
    constructor() {
        super(DIR);
    }

    async getAll(type: BlockType): Promise<Block[]> {
        let files = await fs.readdir(path.join(this.baseDir, type));

        files = files.filter(file => !file.startsWith('.'));

        return Promise.all(
            files.map(async file => {
                const fileContents = await fs.promises.readFile(
                    path.join(this.baseDir, type, file),
                    'utf-8'
                );

                return JSON.parse(fileContents);
            })
        );
    }

    async getById(blockSlug: Block|string, type: string): Promise<Block> {
        const fileContents = await fs.promises.readFile(
            path.join(this.baseDir, type, `${blockSlug}.json`),
            'utf-8'
        );
        if (!fileContents) { throw new Error(`Block ${blockSlug} could not be found.`) }

        return JSON.parse(fileContents);
    };
}

export default new BlockService();
