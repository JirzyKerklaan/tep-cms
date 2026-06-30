import {Service} from "@core/admin/services/service";
import path from 'path';
import {Block} from "@core/interfaces/Block";
import {BlockType} from "@core/interfaces/types/BlockType";

const DIR = path.join(process.cwd(), 'src', 'content', 'schemas');

export class BlockService extends Service {
    constructor() {
        super(DIR);
    }

    async getAll(type: BlockType): Promise<Block[]> {
        const files = await this.listFiles(this.resolve(type));

        return Promise.all(
            files.map(file =>
                this.readJson<Block>(this.resolve(type, file))
            )
        );
    }

    async getById(blockSlug: Block|string, type: BlockType): Promise<Block> {
        return this.readJson<Block>(this.resolve(type, `${blockSlug}.json`));
    };

    async create(block: Block): Promise<Block> {
        await this.writeJson(this.resolve(block.type, `${block.id}.json`), block)

        return block
    }
}

export default new BlockService();
