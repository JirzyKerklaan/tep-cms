"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function registerComponents(hbs) {
    const componentsDir = path_1.default.join(process.cwd(), '/src/blocks');
    function registerFromDir(dir) {
        const entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
        entries.forEach(entry => {
            const fullPath = path_1.default.join(dir, entry.name);
            if (entry.isDirectory()) {
                registerFromDir(fullPath);
            }
            else if (entry.isFile() && path_1.default.extname(entry.name) === '.hbs') {
                const name = path_1.default.parse(entry.name).name;
                const template = fs_1.default.readFileSync(fullPath, 'utf-8');
                hbs.handlebars.registerPartial(name, template);
            }
        });
    }
    registerFromDir(componentsDir);
    hbs.handlebars.registerHelper('partial', function (name, options) {
        const partial = hbs.handlebars.partials[name];
        if (!partial) {
            throw new Error(`Partial "${name}" not found`);
        }
        const template = typeof partial === 'string'
            ? hbs.handlebars.compile(partial)
            : partial;
        return template(this, options);
    });
}
exports.default = registerComponents;
