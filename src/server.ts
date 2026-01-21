import chokidar from 'chokidar';
import app from './app';
import { buildContentIndex } from '../core/services/contentIndex';
import config from "./config";

const PORT = config.server.PORT || 3000;

(async () => {
  await buildContentIndex();
  console.log('🔍 Content index built');

  chokidar.watch('./content/collections/**/*').on('change', async () => {
    await buildContentIndex();
    console.log('🔄 Content index updated');
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
