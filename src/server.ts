import chokidar from 'chokidar';
import app from '@core/app';
import { buildContentIndex } from '@core/services/contentIndex';
import config from "@root/config";

const PORT = config.server.PORT || 3000;

(async () => {
  await buildContentIndex();
  console.log('🔍 Content index built');

  chokidar.watch('./src/content/**/**/*').on('change', async () => {
    await buildContentIndex();
    console.log('🔄 Content index updated');
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
