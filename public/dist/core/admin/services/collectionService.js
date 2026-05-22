"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const errors_1 = require("../../../src/utils/errors");
const COLLECTIONS_DIR = path_1.default.join(process.cwd(), 'content', 'collections');
const SCHEMAS_DIR = path_1.default.join(process.cwd(), 'content', 'schemas', 'collections');
fs_extra_1.default.ensureDirSync(COLLECTIONS_DIR);
fs_extra_1.default.ensureDirSync(SCHEMAS_DIR);
class CollectionService extends service_1.Service {
    constructor() {
        super(COLLECTIONS_DIR);
        this.create = async (data) => {
            if (!data.name)
                throw new Error(errors_1.ERROR_CODES["TEP465"]);
            const id = Date.now().toString();
            const newCollection = { id, name: data.name };
            await this.save(newCollection);
            const folderPath = path_1.default.join(COLLECTIONS_DIR, newCollection.name);
            await fs_extra_1.default.mkdir(folderPath, { recursive: true });
            const schemaContent = JSON.stringify({ schema: newCollection.name }, null, 2);
            await fs_extra_1.default.writeFile(path_1.default.join(SCHEMAS_DIR, `${newCollection.name}.schema.json`), schemaContent, 'utf-8');
            const fileContent = JSON.stringify({ title: `First ${newCollection.name}` }, null, 2);
            await fs_extra_1.default.writeFile(path_1.default.join(folderPath, 'standard.json'), fileContent, 'utf-8');
            return newCollection;
        };
        this.getAllWithEntryCount = async () => {
            const collections = await fs_extra_1.default.readdir(COLLECTIONS_DIR);
            const results = [];
            for (const folderName of collections) {
                const folderPath = path_1.default.join(COLLECTIONS_DIR, folderName);
                const stat = await fs_extra_1.default.stat(folderPath);
                if (stat.isDirectory()) {
                    const files = await fs_extra_1.default.readdir(folderPath);
                    const jsonFiles = files.filter(f => f.endsWith('.json'));
                    results.push({
                        name: folderName,
                        count: jsonFiles.length,
                    });
                }
            }
            return results;
        };
    }
}
exports.default = new CollectionService();
