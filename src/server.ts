import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

import { routes, managerRoutes, upload, search } from './routes'
import { sessionMiddleware } from './middlewares/session';
import { globalLocals } from './middlewares/globalLocales';
import chokidar from 'chokidar';
import { buildContentIndex } from './services/contentIndex';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', [
  path.join(process.cwd(), 'src/templates/'),
  path.join(process.cwd(), 'src/blocks/')
]);

chokidar.watch('./content/collections/**/*').on('change', async () => {
  await buildContentIndex();
  console.log('🔄 Content index updated');
});

app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(globalLocals);

app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/', routes);
app.use('/', upload);
app.use('/', search);
app.use('/manager', managerRoutes);

(async () => {
  await buildContentIndex();
  console.log('🔍 Content index built');

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
})();
