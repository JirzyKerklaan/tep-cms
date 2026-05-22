"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const api_rate_limit_1 = require("@the-node-forge/api-rate-limit");
const session_1 = require("../core/middlewares/session");
const globalLocales_1 = require("../core/middlewares/globalLocales");
const routes_1 = __importDefault(require("./routes"));
const scheduler_1 = require("./utils/scheduler");
const serve_favicon_1 = __importDefault(require("serve-favicon"));
require("./plugins");
const namedRoutes_1 = require("./utils/namedRoutes");
const app = (0, express_1.default)();
(0, scheduler_1.startScheduler)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Views
app.set('view engine', 'twig');
app.set('views', path_1.default.join(process.cwd(), 'src/views/'));
// Middleware
app.use(session_1.sessionMiddleware);
app.use(globalLocales_1.globalLocals);
// Static files
app.use((0, serve_favicon_1.default)(path_1.default.join(process.cwd(), 'public', 'favicon.ico')));
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
// Rate limiter
const limiter = new api_rate_limit_1.RateLimiter({ windowMs: 60000, maxRequests: 10 });
app.use('/api/', (0, api_rate_limit_1.rateLimitMiddleware)(limiter));
// Routes
app.use(routes_1.default);
app.locals.route = namedRoutes_1.route;
exports.default = app;
