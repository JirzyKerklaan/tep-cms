import chokidar from 'chokidar';
import app from '@core/app';
import { buildContentIndex } from '@core/services/contentIndex';
import config from "@root/config";
import {contentRegistry} from "@core/content/contentRegistry";

const PORT = config.server.PORT || 3000;
const HOSTNAME = config.server.HOST || 'http://tep.test';

(async () => {
  await buildContentIndex();
  console.log('🔍 Content index built');

  chokidar.watch('./src/content/collections/**/*').on('change', async () => {
    await buildContentIndex();
    console.log('🔄 Content index updated');
  });

  await contentRegistry.build();
  console.log('🗂️ Content registry built');

  app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at ${HOSTNAME}:${PORT}`);
  });
})();
