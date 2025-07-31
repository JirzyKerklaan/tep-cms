import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

import routes from './routes/routes';
import managerRoutes from './routes/managerRoutes';
import { sessionMiddleware } from './middlewares/session';
import { globalLocals } from './middlewares/globalLocales';
import uploadRoutes from './routes/uploadRoutes';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', [
  path.join(process.cwd(), 'src/templates/'),
  path.join(process.cwd(), 'src/blocks/')
]);

app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(globalLocals);

app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/', routes);
app.use('/', uploadRoutes);
app.use('/manager', managerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
