import fs from 'fs/promises';
import path from 'path';
import {ERROR_CODES} from "../../utils/errors";

interface Collection {
  id: string;
  name: string;
}

const collections: Collection[] = [];

const collectionService = {
  async createCollection(data: Partial<Collection>) {
    if (!data.name) throw new Error(ERROR_CODES["TEP465"]);

    const schemaPath = path.join(process.cwd(), 'content', 'schemas', 'collections' );
    const folderPath = path.join(process.cwd(), 'content', 'collections', data.name);

    try {
      await fs.stat(schemaPath);
      await fs.stat(folderPath);

      throw new Error(ERROR_CODES["TEP464"]);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    const id = Date.now().toString();
    const newCollection = { id, ...data } as Collection;
    collections.push(newCollection);

    const schemaContent = JSON.stringify({schema: `${newCollection.name}`}, null, 2);
    await fs.writeFile(path.join(schemaPath, `${data.name}.schema.json`), schemaContent, 'utf-8');

    await fs.mkdir(folderPath, { recursive: true });

    const fileContent = JSON.stringify({title: `First ${newCollection.name}`}, null, 2);
    await fs.writeFile(path.join(folderPath, 'standard.json'), fileContent, 'utf-8');

    return newCollection;
  },

  async getCollectionById(id: string) {
    return collections.find(c => c.id === id);
  },

  async updateCollection(id: string, data: Partial<Collection>) {
    const index = collections.findIndex(c => c.id === id);
    if (index === -1) throw new Error(ERROR_CODES["TEP462"]);
    collections[index] = { ...collections[index], ...data };
  },

  async getAllCollections() {
    const collectionsPath = path.join(process.cwd(), 'content', 'collections');

    try {
      const items = await fs.readdir(collectionsPath, { withFileTypes: true });

      const folderNames = items
          .filter(item => item.isDirectory())
          .map(item => item.name);

      return folderNames;
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }
};

export default collectionService;
