"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const controller_1 = require("./controller");
const blockService_1 = __importDefault(require("../services/blockService"));
const errors_1 = require("../../../src/utils/errors");
class BlockController extends controller_1.Controller {
    constructor() {
        super('admin/blocks', 'blocks');
        this.newForm = (req, res) => {
            res.render(`${this.viewFolder}/new`, { layout: 'layouts/admin', title: 'Create Block' });
        };
        this.create = async (req, res) => {
            const id = (0, uuid_1.v4)();
            const { block, type, fieldsJson } = req.body;
            const fields = JSON.parse(fieldsJson);
            const cleanFields = fields.map(f => ({
                id: f.id,
                name: f.name,
                type: f.type,
                label: f.label,
                required: f.required ?? false,
                defaultValue: f.defaultValue
            }));
            await blockService_1.default.save({ id, block, type, fields: cleanFields });
            res.redirect('/admin/blocks');
        };
        this.editForm = async (req, res) => {
            const block = await blockService_1.default.getById(req.params.id);
            if (!block) {
                res.status(404).send(errors_1.ERROR_CODES["TEP471"]);
                return;
            }
            res.render(`${this.viewFolder}/edit`, { layout: 'layouts/admin', title: 'Edit Block', block });
        };
        this.update = async (req, res) => {
            const { block, fields, type } = req.body;
            await blockService_1.default.update(req.params.id, {
                block,
                type,
                fields: JSON.parse(fields),
            });
            res.redirect('/admin/blocks');
        };
        this.delete = async (req, res) => {
            try {
                await blockService_1.default.delete(req.params.id);
                res.redirect('/admin/blocks');
            }
            catch {
                res.status(500).send(errors_1.ERROR_CODES["TEP450"]);
            }
        };
        this.list = async (req, res) => {
            try {
                const blocks = await blockService_1.default.getAll();
                res.render(`${this.viewFolder}/list`, { layout: 'layouts/admin', user: req.session.user, blocks });
            }
            catch {
                res.status(500).send(errors_1.ERROR_CODES["TEP450"]);
            }
        };
    }
}
exports.default = new BlockController();
