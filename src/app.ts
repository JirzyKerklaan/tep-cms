import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

import { sessionMiddleware } from '../core/middlewares/session';
import { globalLocals } from '../core/middlewares/globalLocales';
import router from './routes';
import {startScheduler} from "./utils/scheduler";

const app = express();
startScheduler();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views
app.set('view engine', 'ejs');
app.set('views', [
    path.join(process.cwd(), 'src/templates/'),
    path.join(process.cwd(), 'src/blocks/')
]);

// Layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(sessionMiddleware);
app.use(globalLocals);

app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.use(router);

export default app;
