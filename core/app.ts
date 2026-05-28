import express from 'express';
import path from 'path';
import { RateLimiter, rateLimitMiddleware } from '@the-node-forge/api-rate-limit';
import { sessionMiddleware } from './admin/middlewares/session';
import { globalLocals } from './admin/middlewares/globalLocales';
import router from './admin/routes';
import {startScheduler} from "./utils/scheduler";
import favicon from 'serve-favicon';

import "../src/plugins";
import {route} from "./utils/namedRoutes";

const app = express();
startScheduler();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views
app.set('view engine', 'twig');
app.set('views', path.join(process.cwd(), 'src/views/'));

// Middleware
app.use(sessionMiddleware);
app.use(globalLocals);

// Static files
app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')));
app.use(express.static(path.join(process.cwd(), 'public')));

// Rate limiter
const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 10 });
app.use('/api/', rateLimitMiddleware(limiter));

// Routes
app.use(router);

app.locals.route = route;

export default app;
