import chokidar from 'chokidar';
import app from '@core/app';
import { buildContentIndex } from '@core/services/contentIndex';
import config from "@root/config";

const PORT = config.server.PORT || 3000;
const HOSTNAME = config.server.HOST || 'http://tep.test';

(async () => {
  await buildContentIndex();
  console.log('🔍 Content index built');

  chokidar.watch('./src/content/collections/**/*').on('change', async () => {
    await buildContentIndex();
    console.log('🔄 Content index updated');
  });

  app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at ${HOSTNAME}:${PORT}`);
  });
})();
