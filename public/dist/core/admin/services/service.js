"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class Service {
    constructor(baseDir) {
        this.baseDir = baseDir;
        fs_extra_1.default.ensureDirSync(baseDir);
    }
    async save(entity, fileName) {
        const file = path_1.default.join(this.baseDir, fileName ?? `${entity.id}.json`);
        await fs_extra_1.default.writeJson(file, entity, { spaces: 2 });
    }
    async getById(id, fileName) {
        const file = path_1.default.join(this.baseDir, fileName ?? `${id}.json`);
        if (!(await fs_extra_1.default.pathExists(file)))
            return null;
        return fs_extra_1.default.readJson(file);
    }
    async update(id, data, fileName) {
        const existing = await this.getById(id, fileName);
        if (!existing)
            throw new Error(`Entity ${id} not found`);
        const updated = { ...existing, ...data };
        await this.save(updated, fileName);
    }
    async delete(id, fileName) {
        const file = path_1.default.join(this.baseDir, fileName ?? `${id}.json`);
        if (await fs_extra_1.default.pathExists(file)) {
            await fs_extra_1.default.remove(file);
        }
    }
    async getAll() {
        const files = await fs_extra_1.default.readdir(this.baseDir);
        const results = [];
        for (const file of files) {
            results.push(file);
        }
        return results;
    }
}
exports.Service = Service;
