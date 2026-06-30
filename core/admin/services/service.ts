import fs from 'fs-extra';
import path from "path";
import {loadFile} from "@core/admin/helpers/fileLoader";

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

export class Service {
    protected contentDir: string;
    protected baseDir: string;

    constructor(baseDir: string) {
        this.contentDir = CONTENT_DIR;
        this.baseDir = baseDir;
        fs.ensureDirSync(baseDir);
    }

    protected async listFiles(
        dir: string,
        extension?: string
    ): Promise<string[]> {
        const files = await fs.readdir(dir);

        return files.filter(file =>
            !file.startsWith(".") &&
            (!extension || path.extname(file) === extension)
        );
    }

    protected async readJson<T>(file: string): Promise<T> {
        const contents = await loadFile(file);

        if (!contents) {
            throw new Error(`Could not load ${file}`);
        }

        return JSON.parse(contents);
    }

    protected async writeJson(file: string, data: unknown): Promise<void> {
        await fs.ensureDir(path.dirname(file));
        await fs.writeJson(file, data, {spaces: 2});
    }

    protected async exists(file: string): Promise<boolean> {
        return fs.pathExists(file);
    }

    protected async remove(file: string): Promise<void> {
        await fs.remove(file);
    }

    protected resolve(...parts: string[]) {
        return path.join(this.baseDir, ...parts);
    }

    protected resolveSchema(...parts: string[]) {
        return path.join(this.contentDir, 'schemas', ...parts);
    }
}
