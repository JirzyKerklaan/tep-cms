import {Entry} from "@core/interfaces/Entry";
import {Service} from "@core/admin/services/service";
import fs from 'fs-extra';
import path from 'path';

const COLLECTIONS_DIR = path.join(process.cwd(), 'src', 'content', 'collections');
fs.ensureDirSync(COLLECTIONS_DIR);

export class EntryService extends Service<Entry> {
    constructor() {
        super(COLLECTIONS_DIR);
    }
}

export default new EntryService();
