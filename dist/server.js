"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exphbs = __importStar(require("express-handlebars"));
const path_1 = __importDefault(require("path"));
const registerComponents_1 = __importDefault(require("./helpers/registerComponents"));
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
const PORT = 3000;
const hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: path_1.default.join(process.cwd(), '/src/templates/layouts'),
    defaultLayout: 'main',
    partialsDir: path_1.default.join(process.cwd(), '/src/templates/partials'),
    helpers: {}
});
(0, registerComponents_1.default)(hbs);
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path_1.default.join(process.cwd(), '/src/templates'));
app.use(express_1.default.static(path_1.default.join(process.cwd(), '/public')));
app.use(routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
