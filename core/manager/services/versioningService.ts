import fs from 'fs-extra';
import path from 'path';
import {VersioningServiceOptions} from "../../interfaces/VersioningServiceInterface";

export class VersioningService {
    private baseDir: string;
    private maxVersions: number;

    constructor(options: VersioningServiceOptions) {
        this.baseDir = options.baseDir;
        this.maxVersions = options.maxVersions ?? 5;
    }

    async saveVersion(collectionName: string, slug: string, data: any): Promise<void> {
        const collectionDir = path.join(this.baseDir, collectionName);
        const filePath = path.join(collectionDir, `${slug}.json`);
        const olderDir = path.join(collectionDir, 'older');

        await fs.ensureDir(olderDir);

        if (await fs.pathExists(filePath)) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path.join(olderDir, `${slug}-${timestamp}.json`);
            await fs.copy(filePath, backupFile);

            // Rotate older files
            const olderFiles = (await fs.readdir(olderDir))
                .filter(f => f.startsWith(slug) && f.endsWith('.json'))
                .sort();
            if (olderFiles.length > this.maxVersions) {
                const toDelete = olderFiles.slice(0, olderFiles.length - this.maxVersions);
                for (const f of toDelete) await fs.remove(path.join(olderDir, f));
            }
        }

        await fs.outputJson(filePath, data, { spaces: 2 });
    }

    async getVersions(collectionName: string, slug: string): Promise<string[]> {
        const olderDir = path.join(this.baseDir, collectionName, 'older');
        if (!(await fs.pathExists(olderDir))) return [];
        return (await fs.readdir(olderDir))
            .filter(f => f.startsWith(slug) && f.endsWith('.json'))
            .sort()
            .reverse(); // newest last
    }

    async restoreVersion(collectionName: string, slug: string, filename: string): Promise<void> {
        const collectionDir = path.join(this.baseDir, collectionName);
        const filePath = path.join(collectionDir, `${slug}.json`);
        const olderDir = path.join(collectionDir, 'older');
        const olderFile = path.join(collectionDir, 'older', filename);

        if (!(await fs.pathExists(olderFile))) throw new Error('Version not found');

        // Backup current
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await fs.copy(filePath, path.join(collectionDir, 'older', `${slug}-${timestamp}.json`));

        // Restore selected version
        await fs.copy(olderFile, filePath);

        // Optional: rotate older files after restore
        const olderFiles = (await fs.readdir(olderDir))
            .filter(f => f.startsWith(slug) && f.endsWith('.json'))
            .sort();
        if (olderFiles.length > this.maxVersions) {
            const toDelete = olderFiles.slice(0, olderFiles.length - this.maxVersions);
            for (const f of toDelete) await fs.remove(path.join(olderDir, f));
        }
    }
}

export default VersioningService;