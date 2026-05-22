"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = __importDefault(require("chokidar"));
const app_1 = __importDefault(require("./app"));
const contentIndex_1 = require("../core/services/contentIndex");
const config_1 = __importDefault(require("./config"));
const PORT = config_1.default.server.PORT || 3000;
(async () => {
    await (0, contentIndex_1.buildContentIndex)();
    console.log('🔍 Content index built');
    chokidar_1.default.watch('./content/collections/**/*').on('change', async () => {
        await (0, contentIndex_1.buildContentIndex)();
        console.log('🔄 Content index updated');
    });
    app_1.default.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})();
