import fs from 'fs-extra';
import path from 'path';
import { BaseEntity } from '@core/interfaces/BaseEntity';

export class Service<T extends BaseEntity> {
    protected baseDir: string;

    constructor(baseDir: string) {
        this.baseDir = baseDir;
        fs.ensureDirSync(baseDir);
    }

    async save(entity: T, fileName?: string): Promise<void> {
        const file = path.join(this.baseDir, fileName ?? `${entity.id}.json`);
        await fs.writeJson(file, entity, { spaces: 2 });
    }

    async getById(id: string, fileName?: string): Promise<T | null> {
        const file = path.join(this.baseDir, fileName ?? `${id}.json`);
        if (!(await fs.pathExists(file))) return null;
        return fs.readJson(file) as Promise<T>;
    }

    async update(item: BaseEntity ): Promise<void> {
        const existing = await this.getById(item.id);
        if (!existing) throw new Error(`Entity ${item.id} not found`);
        const updated = { ...existing, ...item };
        await this.save(updated as T, item.name);
    }

    async delete(id: string, fileName?: string): Promise<void> {
        const file = path.join(this.baseDir, fileName ?? `${id}.json`);
        if (await fs.pathExists(file)) {
            await fs.remove(file);
        }
    }

    async getAll(subDir: string|null = null): Promise<string[]> {
        const DIR = subDir
            ? path.join(this.baseDir, subDir)
            : this.baseDir;

        let files = await fs.readdir(DIR);
        const results: string[] = [];
        files = files.filter(file => !file.startsWith('.'));
        for (const file of files) {
            results.push(file);
        }
        return results;
    }
}
