import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';
import {Collection} from "@core/interfaces/Collection";

const COLLECTIONS_DIR = path.join(process.cwd(), 'src', 'content', 'collections');
fs.ensureDirSync(COLLECTIONS_DIR);

export class CollectionService extends Service<Collection> {
    constructor() {
        super(COLLECTIONS_DIR);
    }
}

export default new CollectionService();
