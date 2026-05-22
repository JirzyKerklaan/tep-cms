"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectService = void 0;
// services/redirectService.ts
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class RedirectService {
    constructor() {
        this.basePath = path_1.default.join(process.cwd(), 'content');
    }
    async getById(collection, id) {
        const filePath = path_1.default.join(this.basePath, collection, `${id}.json`);
        try {
            const file = await fs_1.promises.readFile(filePath, 'utf-8');
            return JSON.parse(file);
        }
        catch (error) {
            throw new Error(`Failed to load ${collection}/${id}.json: ${error.message}`);
        }
    }
}
exports.redirectService = new RedirectService();
