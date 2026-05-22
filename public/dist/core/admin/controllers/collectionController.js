"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
const collectionService_1 = __importDefault(require("../services/collectionService"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const defaultFieldsHelper_1 = require("../helpers/defaultFieldsHelper");
const errors_1 = require("../../../src/utils/errors");
class CollectionController extends controller_1.Controller {
    constructor() {
        super('admin/collections', 'collections');
        this.list = async (req, res) => {
            try {
                const collections = await collectionService_1.default.getAll();
                res.render(`${this.viewFolder}/list`, { layout: 'layouts/admin', user: req.session.user, collections });
            }
            catch {
                res.render(`${this.viewFolder}/list`, { layout: 'layouts/admin', user: req.session.user, error: errors_1.ERROR_CODES["TEP460"] });
            }
        };
        this.newForm = (req, res) => {
            const blocksDir = path_1.default.join(process.cwd(), 'src', 'views', 'page_builder');
            const blocks = fs_extra_1.default
                .readdirSync(blocksDir)
                .filter(file => file.endsWith('.twig'))
                .map(file => path_1.default.basename(file, '.twig'));
            res.render(`${this.viewFolder}/new`, {
                layout: 'layouts/admin',
                title: 'Create Collection',
                blocks,
            });
        };
        this.create = async (req, res) => {
            const { name, blocks } = req.body;
            const selectedBlocks = Array.isArray(blocks) ? blocks : [blocks];
            const schema = {
                name,
                page_builder: selectedBlocks,
                created_at: new Date().toISOString()
            };
            const schemaPath = path_1.default.join(process.cwd(), 'content', 'schemas', 'collections', `${name}.schema.json`);
            await fs_extra_1.default.outputJson(schemaPath, schema, { spaces: 2 });
            const blockData = [];
            for (const block of selectedBlocks) {
                const blockSchemaPath = path_1.default.join(process.cwd(), 'src', 'blocks', 'schemas', 'page_builder', `${block}.schema.json`);
                if (await fs_extra_1.default.pathExists(blockSchemaPath)) {
                    const blockSchema = await fs_extra_1.default.readJson(blockSchemaPath);
                    const defaultFields = (0, defaultFieldsHelper_1.getDefaultFields)(blockSchema.fields || []);
                    blockData.push({ block, fields: defaultFields });
                }
            }
            const standard = {
                title: '',
                slug: '',
                content: '',
                page_builder: blockData,
                scheduledAt: req.body.scheduledAt || null,
            };
            const standardPath = path_1.default.join(process.cwd(), 'content', 'collections', name, 'standard.json');
            await fs_extra_1.default.outputJson(standardPath, standard, { spaces: 2 });
            res.redirect('/admin/collections');
        };
        this.editForm = async (req, res) => {
            const id = req.params.id;
            try {
                const collection = await collectionService_1.default.getById(id);
                if (!collection) {
                    res.render(`${this.viewFolder}/edit`, { layout: 'layouts/admin', user: req.session.user, error: errors_1.ERROR_CODES["TEP461"] });
                    return;
                }
                res.render(`${this.viewFolder}/edit`, { layout: 'layouts/admin', user: req.session.user, collection, error: errors_1.ERROR_CODES["TEP200"] });
            }
            catch {
                res.render(`${this.viewFolder}/edit`, { layout: 'layouts/admin', user: req.session.user, error: errors_1.ERROR_CODES["TEP462"] });
            }
        };
        this.update = async (req, res) => {
            const id = req.params.id;
            const data = {
                ...req.body,
                scheduledAt: req.body.scheduledAt || null
            };
            try {
                await collectionService_1.default.update(id, data);
                res.redirect('/admin/collections');
            }
            catch {
                res.render(`${this.viewFolder}/edit`, { layout: 'layouts/admin', user: req.session.user, collection: { id, ...data }, error: errors_1.ERROR_CODES["TEP462"] });
            }
        };
    }
}
exports.default = new CollectionController();
