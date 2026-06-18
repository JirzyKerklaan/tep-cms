import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {Block} from "@core/interfaces/Block";

const COLLECTIONS_DIR = path.join(process.cwd(), 'src', 'content', 'blocks', 'schemas');
fs.ensureDirSync(COLLECTIONS_DIR);

export class BlockService extends Service<Block> {
    constructor() {
        super(COLLECTIONS_DIR);
    }
}

export default new BlockService();
