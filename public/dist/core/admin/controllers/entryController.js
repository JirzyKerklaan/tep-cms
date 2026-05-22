"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
const entryService_1 = __importDefault(require("../services/entryService"));
const versioningService_1 = require("../services/versioningService");
const errors_1 = require("../../../src/utils/errors");
const path_1 = __importDefault(require("path"));
class EntryController extends controller_1.Controller {
    constructor() {
        super('admin/entries', 'entries');
        this.list = async (req, res) => {
            try {
                const entries = await entryService_1.default.getAll();
                res.render(`${this.viewFolder}/list`, { layout: 'layouts/admin', user: req.session.user, entries });
            }
            catch {
                res.render(`${this.viewFolder}/list`, { layout: 'layouts/admin', user: req.session.user, error: errors_1.ERROR_CODES["TEP460"] });
            }
        };
        this.newForm = (req, res) => {
            res.render(`${this.viewFolder}/new`, {
                layout: 'layouts/admin',
                title: 'Create Entry',
                collection: req.params.collection
            });
        };
        this.create = async (req, res) => {
            const collection = req.params.collection;
            try {
                entryService_1.default.saveEntry(collection, req.body);
                res.redirect(`/admin/collections/${collection}`);
            }
            catch {
                res.status(500).render(`${this.viewFolder}/new`, {
                    layout: 'layouts/admin',
                    title: 'Create Entry',
                    error: 'Failed to create entry file.',
                });
            }
        };
        this.editForm = async (req, res) => {
            const id = req.params.id;
            const collectionName = req.params.collection;
            const versioningService = new versioningService_1.VersioningService({
                baseDir: path_1.default.join(process.cwd(), 'content', 'collections'),
                maxVersions: 5,
            });
            const olderVersions = await versioningService.getVersions(collectionName, id);
            try {
                const entry = await entryService_1.default.getById(collectionName, id);
                if (!entry) {
                    res.render(`${this.viewFolder}/edit`, { layout: 'layouts/admin', user: req.session.user, error: errors_1.ERROR_CODES["TEP461"] });
                    return;
                }
                res.render(`${this.viewFolder}/edit`, { layout: 'layouts/admin', user: req.session.user, entry, olderVersions, error: errors_1.ERROR_CODES["TEP200"] });
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
                await entryService_1.default.update(id, data);
                res.redirect('/admin/entries');
            }
            catch {
                res.render(`${this.viewFolder}/edit`, { layout: 'layouts/admin', user: req.session.user, entry: { id, ...data }, error: errors_1.ERROR_CODES["TEP462"] });
            }
        };
    }
}
exports.default = new EntryController();
