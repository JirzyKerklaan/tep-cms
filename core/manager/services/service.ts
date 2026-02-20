import fs from 'fs-extra';
import path from 'path';
import { BaseEntity } from '../../interfaces/BaseEntity';
import PluginManager from "../plugins/pluginManager";
import {SanitizedString} from "../classes/sanitizedString";


export class Service<T extends BaseEntity> {
    protected baseDir: string;

    constructor(baseDir: string) {
        this.baseDir = baseDir;
        fs.ensureDirSync(baseDir);
    }

    async save(entity: T, fileName?: string): Promise<void> {
        const safeFileName = fileName
            ? new SanitizedString(fileName).toString()
            : `${entity.id}.json`;

        const file = path.join(this.baseDir, safeFileName);
        await fs.writeJson(file, entity, { spaces: 2 });
    }

    async getById(id: string, fileName?: string): Promise<T | null> {
        const file = path.join(this.baseDir, fileName ?? `${new SanitizedString(id).toString()}.json`);
        if (!(await fs.pathExists(file))) return null;
        return fs.readJson(file) as Promise<T>;
    }

    async update(id: string, data: Partial<T>, fileName?: string): Promise<void> {
        const existing = await this.getById(id, fileName);
        if (!existing) throw new Error(`Entity ${id} not found`);
        const updated = { ...existing, ...data };
        await this.save(updated as T, fileName);
    }

    async delete(id: string, fileName?: string): Promise<void> {
        const file = path.join(this.baseDir, fileName ?? `${id}.json`);
        if (await fs.pathExists(file)) {
            await fs.remove(file);
        }
    }

    async getAll(): Promise<string[]> {
        const files = await fs.readdir(this.baseDir);
        const results: string[] = [];
        for (const file of files) {
            results.push(file);
        }
        return results;
    }
}
