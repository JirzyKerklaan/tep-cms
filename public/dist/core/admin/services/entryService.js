"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const service_1 = require("./service");
const versioningService_1 = __importDefault(require("./versioningService"));
const pluginManager_1 = __importDefault(require("../plugins/pluginManager"));
const COLLECTIONS_DIR = path_1.default.join(process.cwd(), 'content', 'collections');
fs_extra_1.default.ensureDirSync(COLLECTIONS_DIR);
class EntryService extends service_1.Service {
    constructor() {
        super(COLLECTIONS_DIR);
        this.saveEntry = async (collectionName, data) => {
            const slug = data.slug ?? data.title.toLowerCase().replace(/\s+/g, '-');
            const published = data.scheduled_at ? null : new Date();
            const scheduled = data.scheduled_at ? new Date(data.scheduled_at) : null;
            const entryData = {
                id: '',
                title: data.title,
                slug,
                published_at: published ?? undefined,
                scheduled_at: scheduled ?? undefined,
            };
            await pluginManager_1.default.trigger('beforeEntryCreate', collectionName, entryData);
            const versioningService = new versioningService_1.default({
                baseDir: COLLECTIONS_DIR,
                maxVersions: 5,
            });
            await versioningService.saveVersion(collectionName, slug, entryData);
            await pluginManager_1.default.trigger('afterEntryCreate', collectionName, entryData);
            return entryData;
        };
        this.getById = async (collectionName, id) => {
            const file = path_1.default.join(this.baseDir, collectionName, `${id}.json`);
            if (!(await fs_extra_1.default.pathExists(file)))
                return null;
            return fs_extra_1.default.readJson(file);
        };
    }
    async getAllFromCollection(collectionName) {
        const collectionPath = path_1.default.join(this.baseDir, collectionName);
        if (!(await fs_extra_1.default.pathExists(collectionPath)))
            return [];
        const files = await fs_extra_1.default.readdir(collectionPath);
        const results = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const entity = await fs_extra_1.default.readJson(path_1.default.join(collectionPath, file));
                results.push(entity);
            }
        }
        return results;
    }
    ;
    async cronUpdate(collectionName, entrySlug, data) {
        const filePath = path_1.default.join(this.baseDir, collectionName, `${entrySlug}.json`);
        if (!(await fs_extra_1.default.pathExists(filePath))) {
            throw new Error(`Entry "${entrySlug}" not found in collection "${collectionName}"`);
        }
        const existing = await fs_extra_1.default.readJson(filePath);
        const updated = { ...existing, ...data };
        await fs_extra_1.default.writeJson(filePath, updated, { spaces: 2 });
    }
}
exports.default = new EntryService();
