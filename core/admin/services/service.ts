import fs from 'fs-extra';
import path from 'path';
import { BaseEntity } from '@core/interfaces/BaseEntity';
import {Collection} from "@core/interfaces/Collection";
import {Entry} from "@core/interfaces/Entry";
import {BlockInput} from "@core/interfaces/BlockInput";

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

    async update(item: Collection|Entry|BlockInput ): Promise<void> {
        const existing = await this.getById(item.id, item.name);
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

    async getAll(): Promise<string[]> {
        let files = await fs.readdir(this.baseDir);
        const results: string[] = [];
        files = files.filter(file => !file.startsWith('.'));
        for (const file of files) {
            results.push(file);
        }
        return results;
    }
}
