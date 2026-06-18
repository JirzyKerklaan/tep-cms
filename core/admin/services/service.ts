import fs from 'fs-extra';
import { BaseEntity } from '@core/interfaces/BaseEntity';
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

export class Service<T extends BaseEntity> {
    protected contentDir: string;
    protected baseDir: string;

    constructor(baseDir: string) {
        this.contentDir = CONTENT_DIR;
        this.baseDir = baseDir;
        fs.ensureDirSync(baseDir);
    }
}
