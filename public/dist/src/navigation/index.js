"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const navPath = path_1.default.join(process.cwd(), '/content/navigation');
const navigationData = {};
function loadNavigation() {
    if (!fs_1.default.existsSync(navPath))
        return;
    fs_1.default.readdirSync(navPath).forEach(file => {
        if (file.endsWith('.json')) {
            const navName = path_1.default.basename(file, '.json');
            const raw = fs_1.default.readFileSync(path_1.default.join(navPath, file), 'utf-8');
            const parsed = JSON.parse(raw);
            navigationData[navName] = parsed;
        }
    });
}
loadNavigation();
exports.default = navigationData;
