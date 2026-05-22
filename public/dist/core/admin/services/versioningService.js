"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersioningService = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class VersioningService {
    constructor(options) {
        this.baseDir = options.baseDir;
        this.maxVersions = options.maxVersions ?? 5;
    }
    async saveVersion(collectionName, slug, data) {
        const collectionDir = path_1.default.join(this.baseDir, collectionName);
        const filePath = path_1.default.join(collectionDir, `${slug}.json`);
        const olderDir = path_1.default.join(collectionDir, 'older');
        await fs_extra_1.default.ensureDir(olderDir);
        if (await fs_extra_1.default.pathExists(filePath)) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path_1.default.join(olderDir, `${slug}-${timestamp}.json`);
            await fs_extra_1.default.copy(filePath, backupFile);
            // Rotate older files
            const olderFiles = (await fs_extra_1.default.readdir(olderDir))
                .filter(f => f.startsWith(slug) && f.endsWith('.json'))
                .sort();
            if (olderFiles.length > this.maxVersions) {
                const toDelete = olderFiles.slice(0, olderFiles.length - this.maxVersions);
                for (const f of toDelete)
                    await fs_extra_1.default.remove(path_1.default.join(olderDir, f));
            }
        }
        await fs_extra_1.default.outputJson(filePath, data, { spaces: 2 });
    }
    async getVersions(collectionName, slug) {
        const olderDir = path_1.default.join(this.baseDir, collectionName, 'older');
        if (!(await fs_extra_1.default.pathExists(olderDir)))
            return [];
        return (await fs_extra_1.default.readdir(olderDir))
            .filter(f => f.startsWith(slug) && f.endsWith('.json'))
            .sort()
            .reverse(); // newest last
    }
    async restoreVersion(collectionName, slug, filename) {
        const collectionDir = path_1.default.join(this.baseDir, collectionName);
        const filePath = path_1.default.join(collectionDir, `${slug}.json`);
        const olderDir = path_1.default.join(collectionDir, 'older');
        const olderFile = path_1.default.join(collectionDir, 'older', filename);
        if (!(await fs_extra_1.default.pathExists(olderFile)))
            throw new Error('Version not found');
        // Backup current
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await fs_extra_1.default.copy(filePath, path_1.default.join(collectionDir, 'older', `${slug}-${timestamp}.json`));
        // Restore selected version
        await fs_extra_1.default.copy(olderFile, filePath);
        // Optional: rotate older files after restore
        const olderFiles = (await fs_extra_1.default.readdir(olderDir))
            .filter(f => f.startsWith(slug) && f.endsWith('.json'))
            .sort();
        if (olderFiles.length > this.maxVersions) {
            const toDelete = olderFiles.slice(0, olderFiles.length - this.maxVersions);
            for (const f of toDelete)
                await fs_extra_1.default.remove(path_1.default.join(olderDir, f));
        }
    }
}
exports.VersioningService = VersioningService;
exports.default = VersioningService;
