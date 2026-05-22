"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
const blockTemplateHelper_1 = require("../helpers/blockTemplateHelper");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const BLOCKS_DIR = path_1.default.join(process.cwd(), 'src/blocks');
const SCHEMAS_DIR = path_1.default.join(BLOCKS_DIR, 'schemas');
fs_extra_1.default.ensureDirSync(BLOCKS_DIR);
fs_extra_1.default.ensureDirSync(SCHEMAS_DIR);
function normalizeName(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}
class BlockService extends service_1.Service {
    constructor() {
        super(BLOCKS_DIR);
        this.save = async ({ block, type, fields }) => {
            const normalizedBlock = normalizeName(block);
            const blockPath = path_1.default.join(BLOCKS_DIR, type, `${normalizedBlock}.twig`);
            const schemaPath = path_1.default.join(SCHEMAS_DIR, type, `${normalizedBlock}.schema.json`);
            const templateContent = (0, blockTemplateHelper_1.generateBlockTemplate)(type, normalizedBlock, block);
            if (!(await fs_extra_1.default.pathExists(blockPath)))
                await fs_extra_1.default.outputFile(blockPath, templateContent);
            const schema = { title: block, fields };
            await fs_extra_1.default.outputJson(schemaPath, schema, { spaces: 2 });
        };
        this.delete = async (id) => {
            const block = await this.getById(id);
            if (!block)
                return;
            const normalizedBlock = normalizeName(block.block);
            const blockPath = path_1.default.join(BLOCKS_DIR, block.type, `${normalizedBlock}.twig`);
            const schemaPath = path_1.default.join(SCHEMAS_DIR, block.type, `${normalizedBlock}.schema.json`);
            if (await fs_extra_1.default.pathExists(blockPath))
                await fs_extra_1.default.remove(blockPath);
            if (await fs_extra_1.default.pathExists(schemaPath))
                await fs_extra_1.default.remove(schemaPath);
        };
    }
}
exports.default = new BlockService();
