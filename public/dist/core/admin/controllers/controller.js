"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class Controller {
    constructor(viewFolder, modelName) {
        this.viewFolder = viewFolder;
        this.modelName = modelName;
    }
    newForm(req, res) {
        res.render(`${this.viewFolder}/new`, { layout: 'layouts/admin', title: `Create ${this.modelName}` });
    }
    editForm(req, res) {
        const id = req.params.id;
        res.render(`${this.viewFolder}/edit`, { layout: 'layouts/admin', id });
    }
    delete(req, res) {
        try {
            const id = req.params.id;
            const folderPath = path_1.default.join(process.cwd(), 'content', this.modelName, id);
            const schemaPath = path_1.default.join(process.cwd(), 'content', 'schemas', this.modelName, `${id}.schema.json`);
            fs_extra_1.default.remove(folderPath);
            fs_extra_1.default.remove(schemaPath);
            res.redirect(`/admin/${this.modelName}`);
        }
        catch {
            res.redirect(`/admin/${this.modelName}`);
        }
    }
}
exports.Controller = Controller;
