import fs from 'fs/promises';
import path from 'path';

interface Collection {
  id: string;
  name: string;
}

const collections: Collection[] = [];

const collectionHelper = {
  async createCollection(data: Partial<Collection>) {
    if (!data.name) throw new Error('Collection name is required');

    const folderPath = path.join(process.cwd(), 'content', 'collections', data.name);
    const schemaPath = path.join(process.cwd(), 'content', 'schemas', 'collections' );

    try {
      await fs.stat(folderPath);
      throw new Error('That collection already exists');
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    const id = Date.now().toString();
    const newCollection = { id, ...data } as Collection;
    collections.push(newCollection);

    const schemaContent = JSON.stringify({schema: `${newCollection.name}`}, null, 2);
    await fs.writeFile(path.join(schemaPath, `${data.name}.schema.json`), schemaContent, 'utf-8'); // create collection schema

    await fs.mkdir(folderPath, { recursive: true }); // Create collection directory

    const fileContent = JSON.stringify({title: `First ${newCollection.name}`}, null, 2);
    await fs.writeFile(path.join(folderPath, 'standard.json'), fileContent, 'utf-8'); // create first/standard collection entry

    return newCollection;
  },

  async getCollectionById(id: string) {
    return collections.find(c => c.id === id);
  },

  async updateCollection(id: string, data: Partial<Collection>) {
    const index = collections.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Not found');
    collections[index] = { ...collections[index], ...data };
  },

  async getAllCollections() {
    return collections;
  }
};

export default collectionHelper;
