"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildContentIndex = buildContentIndex;
exports.searchContent = searchContent;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const lunr_1 = __importDefault(require("lunr"));
const BASE_DIRS = [
    path_1.default.join(process.cwd(), 'content/collections'),
    path_1.default.join(process.cwd(), 'content/globals'),
    path_1.default.join(process.cwd(), 'content/navigation'),
];
let index = [];
let lunrIndex = null;
async function buildContentIndex() {
    const result = [];
    for (const baseDir of BASE_DIRS) {
        const type = path_1.default.basename(baseDir); // e.g., 'collections', 'globals'
        let jsonFiles = [];
        try {
            jsonFiles = await recursivelyFindJsonFiles(baseDir);
        }
        catch {
            continue;
        }
        for (const filePath of jsonFiles) {
            const slug = path_1.default.basename(filePath, '.json');
            try {
                const jsonRaw = await promises_1.default.readFile(filePath, 'utf-8');
                const data = JSON.parse(jsonRaw);
                result.push({
                    slug,
                    title: data.title || slug,
                    content: JSON.stringify(data),
                    type,
                    path: filePath,
                });
            }
            catch {
                continue;
            }
        }
    }
    index = result;
    buildLunrIndex();
}
async function recursivelyFindJsonFiles(dir) {
    const entries = await promises_1.default.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path_1.default.join(dir, entry.name);
        if (entry.isDirectory()) {
            const nestedFiles = await recursivelyFindJsonFiles(fullPath);
            files.push(...nestedFiles);
        }
        else if (entry.isFile() && entry.name.endsWith('.json')) {
            files.push(fullPath);
        }
    }
    return files;
}
function buildLunrIndex() {
    lunrIndex = (0, lunr_1.default)(function () {
        this.ref('slug');
        this.field('title');
        this.field('content');
        this.field('type');
        this.field('slug');
        index.forEach(entry => this.add(entry));
    });
}
function searchContent(query) {
    if (!lunrIndex)
        return [];
    const results = lunrIndex.search(query);
    const matched = results.map(result => index.find(item => item.slug === result.ref));
    return matched.filter((item) => item !== undefined);
}
