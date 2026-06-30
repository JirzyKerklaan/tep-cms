import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {Block} from "@core/interfaces/Block";
import {BlockType} from "@core/interfaces/types/BlockType";
import {loadFile} from "@core/admin/helpers/fileLoader";

const DIR = path.join(process.cwd(), 'src', 'content', 'schemas');
fs.ensureDirSync(DIR);

export class BlockService extends Service {
    constructor() {
        super(DIR);
    }

    async getAll(type: BlockType): Promise<Block[]> {
        let files = await fs.readdir(path.join(this.baseDir, type));

        files = files.filter(file => !file.startsWith('.'));

        return Promise.all(
            files.map(async file => {
                const fileContents = await loadFile(path.join(this.baseDir, type, file));

                return JSON.parse(fileContents);
            })
        );
    }

    async getById(blockSlug: Block|string, type: string): Promise<Block> {
        const fileContents = await loadFile(path.join(this.baseDir, type, `${blockSlug}.json`));
        if (!fileContents) { throw new Error(`Block ${blockSlug} could not be found.`) }

        return JSON.parse(fileContents);
    };

    async create(block: Block): Promise<Block> {
        const directory = path.join(this.baseDir, block.type);
        await fs.ensureDir(directory);

        await fs.writeJson(path.join(directory, `${block.id}.json`), block, { spaces: 2 });

        return block
    }
}

export default new BlockService();
